import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Sync Google OAuth user to public.User if they don't exist
      try {
        const existingUser = await prisma.user.findUnique({
          where: { supabase_uid: data.user.id }
        })

        if (!existingUser) {
          const nameParts = (data.user.user_metadata?.full_name || '').split(' ')
          const firstName = data.user.user_metadata?.first_name || nameParts[0] || 'Unknown'
          const lastName = data.user.user_metadata?.last_name || nameParts.slice(1).join(' ') || 'User'
          const roleRaw = data.user.user_metadata?.role || 'CUSTOMER'
          const role = (roleRaw.toUpperCase() as Role) || 'CUSTOMER'

          const newUser = await prisma.user.create({
            data: {
              supabase_uid: data.user.id,
              email: data.user.email || '',
              first_name: firstName,
              last_name: lastName,
              role: role,
            }
          })
          
          if (role === 'CUSTOMER') {
            await prisma.customerProfile.create({ data: { user_id: newUser.id } })
          } else if (role === 'ARTISAN') {
            await prisma.artisanProfile.create({ data: { user_id: newUser.id } })
          }
        }
      } catch (dbError) {
        console.error('Error syncing user to database:', dbError)
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google`)
}
