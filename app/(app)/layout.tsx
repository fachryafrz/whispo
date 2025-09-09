"use client";

import { Chat as StreamChat } from "stream-chat-react";

import ImageCarousel from "@/components/modal/image-carousel";
import { streamClient } from "@/lib/stream";
import ChatList from "@/components/chat-list";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex h-svh">
        <StreamChat client={streamClient}>
          <ChatList />
          {children}
        </StreamChat>
      </div>

      <ImageCarousel />
    </>
  );
}
