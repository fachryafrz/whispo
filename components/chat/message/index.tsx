/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useState } from "react";
import { LocalMessage } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";

import Media from "./media";
import MessageOptions from "./message-options";
import ReplyTo from "./reply-to";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

export default function Message({
  msg,
  index,
  isDifferentSenderNext,
  isDifferentSenderPrev,
}: {
  msg: LocalMessage;
  index: number;
  isDifferentSenderPrev?: boolean;
  isDifferentSenderNext?: boolean;
}) {
  const { user: currentUser } = useUser();

  const [open, setOpen] = useState<boolean>(false);
  const isMine = msg.user?.id === currentUser?.username;
  const isEdited = dayjs(msg.updated_at).isAfter(dayjs(msg.created_at));

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger
        className={`group -mx-4 flex gap-1 px-4 transition-background ${
          isMine ? "justify-end" : "justify-start"
        } ${open ? "bg-muted/80" : ""}`}
      >
        {/* Message */}
        <div
          className={`relative w-fit max-w-xs rounded-xl lg:max-w-lg xl:max-w-xl ${
            isMine
              ? `order-2 bg-black text-white dark:bg-white dark:text-black ${
                  isDifferentSenderPrev
                    ? "rounded-br-none"
                    : isDifferentSenderNext
                      ? "rounded-tr-none"
                      : "rounded-r-none"
                }`
              : `order-1 bg-default dark:bg-default-700 ${
                  isDifferentSenderPrev
                    ? "rounded-bl-none"
                    : isDifferentSenderNext
                      ? "rounded-tl-none"
                      : "rounded-l-none"
                }`
          }`}
        >
          <div className="space-y-2 p-2">
            {/* Reply to */}
            {msg.quoted_message_id && !msg.deleted_at && (
              <ReplyTo msg={msg.quoted_message} />
            )}

            {/* Media */}
            {msg.attachments?.length! > 0 && !msg.deleted_at && (
              <Media msg={msg} />
            )}

            {/* Text content */}
            <div className="flex gap-2">
              {/* NOTE: Kalau pakai text, gabisa markdown */}
              {/* <p className="max-w-full whitespace-pre-wrap text-sm">
                      {msg.content}
                    </p> */}

              {/* NOTE: Kalau pakai markdown, gabisa multiple line breaks */}
              <div
                className={`prose text-sm ${
                  isMine
                    ? "text-white marker:text-white dark:text-black dark:marker:text-black"
                    : "text-black marker:text-black dark:text-white dark:marker:text-white"
                }`}
                style={{
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className={`${
                          isMine
                            ? "text-white dark:text-black"
                            : "text-black dark:text-white"
                        }`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {props.children}
                      </a>
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        {...props}
                        className={`${
                          isMine
                            ? "text-white dark:text-black"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {props.children}
                      </blockquote>
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    code: ({ node, ...props }) => (
                      <code {...props} className={`text-white`}>
                        {props.children}
                      </code>
                    ),
                  }}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                >
                  {msg.deleted_at ? `_message was unsent_` : msg.text}
                </ReactMarkdown>
              </div>

              {/* Time placeholder */}
              <div className={`select-none space-x-1 text-[10px] opacity-0`}>
                {/* Edited */}
                {isEdited && <span>Edited</span>}

                <span>{dayjs(msg.created_at).format("HH:mm A")}</span>
              </div>

              {/* Time displayed */}
              <div
                className={`pointer-events-none absolute bottom-1 right-2 space-x-1 text-[10px]`}
              >
                {/* Edited */}
                {isEdited && <span>Edited</span>}

                <span>{dayjs(msg.created_at).format("HH:mm A")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ContextMenuContent */}
        <MessageOptions index={index} msg={msg} />
        {/* ContextMenuContent */}
      </ContextMenuTrigger>
    </ContextMenu>
  );
}
