import { format } from "date-fns"
import { Contact } from "@prisma/client"

interface RecentMessagesProps {
  messages: Contact[]
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-none">
              {message.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {message.email}
            </p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {message.message}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(message.createdAt), 'MMM d')}
          </div>
        </div>
      ))}
    </div>
  )
} 