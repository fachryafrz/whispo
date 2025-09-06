/* eslint-disable @next/next/no-img-element */
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { addToast } from "@heroui/toast";
import { useChatContext } from "stream-chat-react";
import { useSWRConfig } from "swr";

import ReplyTo from "./reply-to";

import { useReplyMessage } from "@/zustand/reply-message";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { streamClient } from "@/lib/stream";

export default function ChatInput() {
  const { channel: selectedChat } = useChatContext();
  const { replyMessage, clearReplyTo } = useReplyMessage();
  const { mutate } = useSWRConfig();

  // State
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;
    if (!streamClient || !selectedChat) return;

    setIsLoading(true);
    try {
      let attachments: any[] = [];

      if (selectedImage) {
        // langsung upload via sendImage
        const upload = await selectedChat.sendImage(selectedImage);

        attachments.push({
          type: "image",
          image_url: upload.file, // url public
        });
      }

      await selectedChat.sendMessage({
        text,
        attachments,
        ...(replyMessage?._id && { parent_id: replyMessage._id }), // untuk reply
      });

      mutate("channels");

      // reset form
      setText("");
      setSelectedImage(null);
      imageInput.current!.value = "";
      clearReplyTo();
    } catch (err) {
      console.error("Send message failed", err);
      addToast({
        title: "Error",
        description: "Failed to send message",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setText("");
    clearReplyTo();
    setSelectedImage(null);
    if (imageInput.current) imageInput.current.value = "";
    setIsLoading(false);
  }, [selectedChat]);

  return (
    <div className={`space-y-2 p-2`}>
      {/* Reply to */}
      {replyMessage && <ReplyTo />}

      {/* Media preview */}
      {selectedImage && (
        <div className="ml-12 flex items-center gap-2">
          <div className="relative overflow-hidden rounded-md before:absolute before:inset-0 before:bg-black before:opacity-50">
            <img
              alt=""
              className="h-20 w-20 object-cover"
              draggable={false}
              src={URL.createObjectURL(selectedImage)}
            />
            <button
              className="absolute right-1 top-1"
              disabled={isLoading}
              onClick={() => {
                setSelectedImage(null);
                imageInput.current!.value = "";
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form
        ref={formRef}
        className="flex items-end gap-2"
        onSubmit={handleSubmit}
      >
        {/* Attachments */}
        <div>
          <Button
            isIconOnly
            isDisabled={isLoading}
            radius="full"
            type="button"
            variant="light"
            onPress={() => imageInput.current?.click()}
          >
            <Paperclip className="text-foreground" size={20} />
          </Button>

          <input
            ref={imageInput}
            accept="image/*"
            className="sr-only"
            disabled={isLoading}
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) return;
              if (file.size > 1024 * 1024) {
                addToast({
                  title: "File too large",
                  description: "File size must be less than 1MB",
                });

                return;
              }
              setSelectedImage(file);
            }}
          />
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          isDisabled={isLoading}
          minRows={1}
          placeholder="Type a message"
          radius="full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e as React.KeyboardEvent<HTMLTextAreaElement>,
              formRef,
            )
          }
        />

        {/* Send */}
        <Button
          disableAnimation
          isIconOnly
          className="bg-black text-white dark:bg-white dark:text-black"
          isDisabled={isLoading}
          isLoading={isLoading}
          radius="full"
          type="submit"
        >
          {!isLoading && <SendHorizontal size={20} />}
        </Button>
      </form>
    </div>
  );
}
