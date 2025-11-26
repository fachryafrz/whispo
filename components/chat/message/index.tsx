/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import dayjs from "dayjs";
import { useState } from "react";

import MessageOptions from "./message-options";
import Media from "./media";
import ReplyTo from "./reply-to";

import { Doc } from "@/convex/_generated/dataModel";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MessageWithMediaState, ReplyToState } from "@/types";

export default function Message({
  msg,
  currentUser,
  index,
  isDifferentSenderNext,
  isDifferentSenderPrev,
}: {
  msg: Doc<"messages">;
  currentUser: Doc<"users">;
  index: number;
  isDifferentSenderPrev?: boolean;
  isDifferentSenderNext?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger
        className={`group -mx-4 flex gap-1 px-4 transition-background ${
          msg.senderId === currentUser?._id ? "justify-end" : "justify-start"
        } ${open ? "bg-muted/80" : ""}`}
      >
        {/* Message */}
        <div
          className={`relative w-fit max-w-xs rounded-xl lg:max-w-lg xl:max-w-xl ${
            msg.senderId === currentUser?._id
              ? `order-2 bg-black text-white dark:bg-white dark:text-black ${
                  isDifferentSenderPrev
                    ? "rounded-br-none"
                    : isDifferentSenderNext
                      ? "rounded-tr-none"
                      : "rounded-r-none"
                }`
              : `order-1 bg-default ${
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
            {msg.replyTo && !msg.isUnsent && (
              <ReplyTo msg={msg.replyTo as unknown as ReplyToState} />
            )}

            {/* Media */}
            {msg.mediaId && !msg.isUnsent && (
              <Media msg={msg as MessageWithMediaState} />
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
                  msg.senderId === currentUser?._id
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
                          msg.senderId === currentUser?._id
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
                          msg.senderId === currentUser?._id
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
                  {msg.isUnsent ? `_message was unsent_` : msg.text}
                </ReactMarkdown>
              </div>

              {/* Time placeholder */}
              <div
                className={`pointer-events-none space-x-1 text-[10px] opacity-0`}
              >
                {/* Edited */}
                {msg.isEdited && <span>Edited</span>}

                <span>{dayjs(msg._creationTime).format("HH:mm A")}</span>
              </div>

              {/* Time displayed */}
              <div
                className={`pointer-events-none absolute bottom-1 right-2 space-x-1 text-[10px]`}
              >
                {/* Edited */}
                {msg.isEdited && <span>Edited</span>}

                <span>{dayjs(msg._creationTime).format("HH:mm A")}</span>
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
