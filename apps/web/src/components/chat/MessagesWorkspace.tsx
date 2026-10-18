'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  ExternalLink, 
  User as UserIcon, 
  Clock, 
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ConversationSummary, getConversations } from '@/app/actions/messages';
import { ChatBox } from '@/components/chat/ChatBox';

interface MessagesWorkspaceProps {
  initialConversations: ConversationSummary[];
  currentUserId: string;
}

export function MessagesWorkspace({
  initialConversations,
  currentUserId,
}: MessagesWorkspaceProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>(initialConversations);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(
    initialConversations[0]?.requestId || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Supabase Realtime subscription to live Message updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('messages_workspace_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Message',
        },
        async () => {
          // Re-fetch conversation summaries on message insert/update
          try {
            const res = await getConversations();
            if (res.conversations) {
              setConversations(res.conversations);
            }
          } catch (e) {
            console.error('Failed to refresh conversations:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.otherParty.name.toLowerCase().includes(q) ||
        c.requestTitle.toLowerCase().includes(q) ||
        (c.lastMessage?.content && c.lastMessage.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.requestId === activeRequestId);
  }, [conversations, activeRequestId]);

  const handleSelectConversation = (requestId: string) => {
    setActiveRequestId(requestId);
    setMobileView('chat');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">COMPLETED</span>;
      case 'DISPUTED':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20">DISPUTED</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">{status}</span>;
    }
  };

  return (
    <div className="border border-border bg-card flex flex-col md:flex-row h-[calc(100vh-180px)] min-h-[550px] shadow-sm">
      {/* Left Pane: Conversations List */}
      <div 
        className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search header */}
        <div className="p-3.5 border-b border-border bg-muted/20 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <MessageSquare className="h-8 w-8 mx-auto opacity-30" />
              <p className="text-xs font-semibold">No conversations found</p>
              <p className="text-[11px] text-muted-foreground/70">
                When you initiate or receive a service request, messaging opens here automatically.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.requestId === activeRequestId;
              return (
                <div
                  key={conv.requestId}
                  onClick={() => handleSelectConversation(conv.requestId)}
                  className={`p-3.5 transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                        {conv.otherParty.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-foreground">
                          {conv.otherParty.name}
                        </p>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          {conv.otherParty.role}
                        </span>
                      </div>
                    </div>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-[11px] text-muted-foreground truncate flex-1 font-medium">
                      {conv.lastMessage
                        ? `${conv.lastMessage.isMine ? 'You: ' : ''}${conv.lastMessage.content}`
                        : 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span className="truncate max-w-[170px] italic">#{conv.requestTitle}</span>
                    {getStatusBadge(conv.status)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chatbox */}
      <div 
        className={`flex-1 flex flex-col ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Chat header */}
            <div className="p-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="h-8 w-8 bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                  {activeConversation.otherParty.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground leading-none">
                    {activeConversation.otherParty.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Job: <span className="font-semibold text-foreground">{activeConversation.requestTitle}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(activeConversation.status)}
                <Link
                  href={`/dashboard/requests/${activeConversation.requestId}`}
                  className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1 p-1"
                >
                  <span className="hidden sm:inline">View Job</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Live Chatbox Component */}
            <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-muted/10">
              <ChatBox
                key={activeConversation.requestId}
                requestId={activeConversation.requestId}
                currentUserId={currentUserId}
                initialMessages={[]}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h4 className="text-sm font-bold uppercase tracking-wide mb-1">Select a Conversation</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Choose a conversation from the left to start live chatting with your client or artisan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
