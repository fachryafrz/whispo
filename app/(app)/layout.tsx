"use client";

import { Chat as StreamChat } from "stream-chat-react";

import ImageCarousel from "@/components/modal/image-carousel";
import { streamClient } from "@/lib/stream";
import "stream-chat-react/dist/css/v2/index.css";
import ChatList from "@/components/chat-list";

import { useTheme } from "next-themes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="relative flex h-svh">
        <StreamChat client={streamClient} theme={resolvedTheme}>
          <ChatList />

          {children}
        </StreamChat>
      </div>

      <ImageCarousel />
    </>
  );
}
