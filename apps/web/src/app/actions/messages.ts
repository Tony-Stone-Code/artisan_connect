'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

export async function getMessages(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get messages for the request
  const messages = await prisma.message.findMany({
    where: { request_id: requestId },
    orderBy: { created_at: 'asc' }
  })

  return { messages }
}

export async function sendMessage(requestId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { error: 'Unauthorized' }

  // Ensure request exists and user has access
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { artisan: true, customer: true }
  })

  if (!request) return { error: 'Request not found' }

  const isArtisan = request.artisan.user_id === dbUser.id
  const isCustomer = request.customer.user_id === dbUser.id

  if (!isArtisan && !isCustomer) {
    return { error: 'Forbidden' }
  }

  // Determine receiver (the other party)
  const receiverId = isArtisan ? request.customer.user_id : request.artisan.user_id

  const message = await prisma.message.create({
    data: {
      request_id: requestId,
      sender_id: dbUser.id,
      content,
    }
  })

  // Realtime in-app notification to the other party
  await createNotification({
    userId: receiverId,
    title: `New message from ${dbUser.first_name}`,
    message: content.length > 70 ? `${content.slice(0, 67)}...` : content,
    type: 'INFO',
    data: { requestId, messageId: message.id },
  })

  revalidatePath(`/dashboard/requests/${requestId}`)

  return { message }
}

export async function getUnreadMessageCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { count: 0 }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { count: 0 }

  // Count messages where the current user is part of the request, 
  // the sender is NOT the current user, and is_read is false
  const count = await prisma.message.count({
    where: {
      is_read: false,
      sender_id: { not: dbUser.id },
      request: {
        OR: [
          { customer: { user_id: dbUser.id } },
          { artisan: { user_id: dbUser.id } }
        ]
      }
    }
  })

  return { count }
}

export async function markMessagesAsRead(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { success: false }

  // Update all unread messages in this request where the current user is NOT the sender
  await prisma.message.updateMany({
    where: {
      request_id: requestId,
      sender_id: { not: dbUser.id },
      is_read: false
    },
    data: {
      is_read: true
    }
  })

  return { success: true }
}

export interface ConversationSummary {
  requestId: string;
  requestTitle: string;
  status: string;
  otherParty: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string | null;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    isMine: boolean;
  };
  unreadCount: number;
}

export async function getConversations(): Promise<{
  conversations: ConversationSummary[];
  currentUserId?: string;
  error?: string;
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { conversations: [], error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { supabase_uid: user.id },
    select: { id: true, role: true }
  })
  if (!dbUser) return { conversations: [], error: 'User not found' }

  const requests = await prisma.serviceRequest.findMany({
    where: {
      OR: [
        { customer: { user_id: dbUser.id } },
        { artisan: { user_id: dbUser.id } }
      ]
    },
    include: {
      customer: { include: { user: true } },
      artisan: { include: { user: true } },
      messages: {
        orderBy: { created_at: 'desc' },
        take: 1
      }
    },
    orderBy: { updated_at: 'desc' }
  })

  const conversations: ConversationSummary[] = await Promise.all(
    requests.map(async (req) => {
      const isCustomer = req.customer.user_id === dbUser.id
      const otherUser = isCustomer ? req.artisan.user : req.customer.user
      const lastMsg = req.messages[0]

      const unreadCount = await prisma.message.count({
        where: {
          request_id: req.id,
          sender_id: { not: dbUser.id },
          is_read: false
        }
      })

      return {
        requestId: req.id,
        requestTitle: req.title,
        status: req.status,
        otherParty: {
          id: otherUser.id,
          name: `${otherUser.first_name} ${otherUser.last_name}`,
          role: otherUser.role,
          avatarUrl: otherUser.avatar_url,
        },
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          createdAt: lastMsg.created_at.toISOString(),
          isMine: lastMsg.sender_id === dbUser.id
        } : undefined,
        unreadCount
      }
    })
  )

  // Sort conversations by latest message timestamp, or request updated_at
  conversations.sort((a, b) => {
    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
    return timeB - timeA
  })

  return { conversations, currentUserId: dbUser.id }
}
