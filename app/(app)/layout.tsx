"use client";

import { Chat as StreamChat } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import ImageCarousel from "@/components/modal/image-carousel";
import { useStoreUserEffect } from "@/hooks/use-store-user";
import { streamClient } from "@/lib/stream";
import ChatList from "@/components/chat-list";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useStoreUserEffect();

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">Loading…</div>
    );
  }

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
