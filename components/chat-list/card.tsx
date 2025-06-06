import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pin, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useSelectedChat } from "@/zustand/selected-chat";

type ChatCardProps = {
  chatId?: Id<"chats">;
  title: string;
  description?: string;
  imageUrl: string;
  info?: boolean;
  timeSent?: string;
  unreadCount?: number;
  pinned?: boolean;
  hasMedia?: boolean;
  onPress: () => void;
};

export default function ChatCard({
  chatId,
  title,
  description = "...",
  imageUrl,
  info = true,
  timeSent,
  unreadCount,
  pinned,
  hasMedia,
  onPress,
}: ChatCardProps) {
  const { selectedChat } = useSelectedChat();

  return (
    <Button
      className={cn(
        "h-auto w-full select-none rounded-none border-b border-default-200 p-4 text-start !outline-none last:border-b-0 dark:border-neutral-800",
        chatId && selectedChat?.chatId === chatId && "bg-default/40",
      )}
      variant="light"
      onPress={onPress}
    >
      <div className="grid w-full grid-cols-[40px_1fr_auto] items-center gap-2">
        {/* Avatar/Image */}
        <Avatar name={title} src={imageUrl} />

        {/* Content */}
        <div className="min-w-0">
          {/* Name */}
          {title ? (
            <h2 className="text-small font-bold">{title}</h2>
          ) : (
            <Skeleton className="h-5 w-1/2 rounded" />
          )}

          {/* Text */}
          {title && description ? (
            <div
              className="flex h-5 items-center gap-1 overflow-hidden"
              title={description}
            >
              {hasMedia && (
                <ImageIcon
                  className={
                    unreadCount
                      ? "font-bold dark:text-white"
                      : "text-default-500"
                  }
                  size={16}
                />
              )}

              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  p: ({ node, ...props }) => (
                    <p
                      className={`overflow-hidden text-ellipsis whitespace-nowrap text-small ${unreadCount ? "font-bold text-white" : "text-default-500"}`}
                      {...props}
                    />
                  ),
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          ) : (
            <Skeleton className="h-5 translate-y-1 rounded" />
          )}
        </div>

        {/* Info */}
        {info && (
          <div className="flex h-full flex-col items-end gap-1">
            {/* Time sent */}
            <span className="text-xs">{timeSent}</span>

            {/* Pinned/Unread Messages */}
            <div className="flex items-center gap-1">
              {pinned && <Pin size={20} />}
              {unreadCount && (
                <Chip className="h-5" size="sm">
                  {unreadCount}
                </Chip>
              )}
            </div>
          </div>
        )}
      </div>
    </Button>
  );
}
