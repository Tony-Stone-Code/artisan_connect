'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendMessage } from '@/app/actions/messages';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface Message {
  id: string;
  service_request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date | string;
}

interface ChatBoxProps {
  requestId: string;
  currentUserId: string;
  initialMessages: Message[];
}

export function ChatBox({ requestId, currentUserId, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Scroll to bottom on mount and when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Subscribe to new messages inserted into the database
    const channel = supabase
      .channel(`chat_${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `service_request_id=eq.${requestId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid adding duplicates if the server action already added it optimistically
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const content = newMessage.trim();
    setNewMessage(''); // optimistic clear

    try {
      const res = await sendMessage(requestId, content);
      if (res.error) {
        console.error('Failed to send message:', res.error);
        // Optionally show error toast here
      } else if (res.message) {
        // Optimistically add to UI if it hasn't arrived via websocket yet
        setMessages((prev) => {
          if (prev.find((m) => m.id === res.message.id)) return prev;
          return [...prev, res.message];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="py-4 border-b">
        <CardTitle className="text-lg">Messages</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground mt-4">
                No messages yet. Send a message to start chatting!
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        isMine 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
