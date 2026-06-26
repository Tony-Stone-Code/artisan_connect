import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function MessagesPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">Communicate with your clients and artisans.</p>
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Inbox Sidebar */}
        <div className="w-1/3 border-r hidden md:flex flex-col">
          <div className="p-4 border-b bg-muted/30">
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 text-center text-muted-foreground text-sm">
              No conversations yet
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-8 text-center">
          <svg className="h-16 w-16 text-muted-foreground mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Your Inbox is Empty</h3>
          <p className="text-muted-foreground">
            Select a conversation from the sidebar or start a new message from a job request.
          </p>
        </div>
      </Card>
    </div>
  );
}
