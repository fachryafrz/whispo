"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Channel, useChatContext } from "stream-chat-react";

import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function Chat() {
  const router = useRouter();
  const pathname = usePathname();

  const { channel: selectedChat } = useChatContext();

  const { clearSelectedChat, showChatRoom, setShowChatRoom } =
    useSelectedChat();

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768;

    if (pathname === "/") {
      setShowChatRoom(false);

      setTimeout(
        () => {
          clearSelectedChat();
        },
        isSmallScreen ? 500 : 0, // If the screen is small, wait 500ms before clearing the selected chat
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pathname !== "/") {
        setShowChatRoom(false);

        setTimeout(
          () => {
            clearSelectedChat();
            router.back();
          },
          isSmallScreen ? 500 : 0, // If the screen is small, wait 500ms before clearing the selected chat
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);

  useEffect(() => {
    if (!selectedChat) return;

    if (selectedChat) {
      setTimeout(() => {
        setShowChatRoom(true);
      }, 100);
    }
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <div className="fixed inset-0 z-10 grow md:static md:z-0 [&>div>div]:h-full [&>div]:h-full">
          <Channel>
            <section
              className={`flex h-full w-full flex-1 flex-col bg-white transition-all duration-500 dark:bg-black ${showChatRoom ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
            >
              {/* Header */}
              <ChatHeader />

              {/* Chat */}
              <ChatMessages />

              {/* Input */}
              <ChatInput />
            </section>
          </Channel>
        </div>
      ) : (
        <section
          className={`hidden h-full place-content-center bg-neutral-100 text-default-500 dark:bg-neutral-950 md:grid md:grow`}
        >
          <h2 className="text-lg font-bold">Select a chat</h2>
        </section>
      )}
    </>
  );
}
