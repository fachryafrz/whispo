import { Button } from "@heroui/button";
import { Reply, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useUser } from "@clerk/clerk-react";

import { useReplyMessage } from "@/zustand/reply-message";

export default function ReplyTo() {
  const { user } = useUser();
  const { replyMessage, clearReplyTo } = useReplyMessage();

  return (
    <div className="flex items-center gap-2">
      {/* Reply Icon */}
      <div className="grid h-10 w-10 place-content-center">
        <Reply size={20} />
      </div>

      {/* Reply info */}
      <div className="pointer-events-none flex-1 space-y-1 rounded-md bg-default p-2 text-xs dark:bg-default-700">
        {/* Title */}
        <span className="block font-semibold">
          Reply to{" "}
          {replyMessage?.user?.id === user?.username
            ? "yourself"
            : replyMessage?.user?.name}
        </span>

        {/* Content */}
        <div
          className={`prose max-h-20 max-w-none overflow-hidden text-xs text-black marker:text-black dark:text-white dark:marker:text-white`}
        >
          <ReactMarkdown
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className={`dark:text-white`}>
                  {props.children}
                </blockquote>
              ),
            }}
          >
            {replyMessage?.deleted_at
              ? `_message was unsent_`
              : replyMessage?.text}
          </ReactMarkdown>
        </div>
      </div>

      {/* Clear */}
      <Button isIconOnly radius="full" variant="light" onPress={clearReplyTo}>
        <X className="text-foreground" size={20} />
      </Button>
    </div>
  );
}
