import ReactMarkdown from "react-markdown";
import { LocalMessage } from "stream-chat";

export default function ReplyTo({
  msg,
}: {
  msg: LocalMessage["quoted_message"];
}) {
  return (
    <div className="pointer-events-none space-y-1 rounded-md bg-white p-2 text-xs text-black dark:bg-black dark:text-white">
      {/* Title */}
      <div>
        Reply to <strong>{msg?.user?.name}</strong>
      </div>

      {/* Content */}
      <div
        className={`prose max-h-20 overflow-hidden text-xs text-black marker:text-black dark:text-white dark:marker:text-white`}
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
          {msg?.deleted_at ? `_message was unsent_` : msg?.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
