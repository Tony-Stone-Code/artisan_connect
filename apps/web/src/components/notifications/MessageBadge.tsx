'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUnreadMessageCount } from '@/app/actions/messages';

export function MessageBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  const fetchUnreadCount = async () => {
    try {
      const { count } = await getUnreadMessageCount();
      setUnreadCount(count || 0);
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Subscribe to any changes on the Message table
    const channel = supabase
      .channel('global_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Message' },
        () => {
          // Whenever a message is inserted, updated, or deleted, refresh the exact unread count
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (unreadCount === 0) return null;

  return (
    <div className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] animate-in fade-in zoom-in duration-300">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
}
