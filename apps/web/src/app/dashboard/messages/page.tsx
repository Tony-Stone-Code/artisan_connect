import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getConversations } from '@/app/actions/messages';
import { MessagesWorkspace } from '@/components/chat/MessagesWorkspace';

export const metadata = {
  title: 'Messages | ArtisanConnect',
  description: 'Realtime chat and messaging with clients and verified artisans.',
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/messages');
  }

  const { conversations, currentUserId } = await getConversations();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">
          Conversations &amp; Messages
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Realtime messaging with your clients and verified artisans across Ghana.
        </p>
      </div>

      <MessagesWorkspace
        initialConversations={conversations || []}
        currentUserId={currentUserId || user.id}
      />
    </div>
  );
}
