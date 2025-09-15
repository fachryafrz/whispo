"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "convex/react";

import SelectAChat from "@/components/chat/select-a-chat";
import { useSelectedChat } from "@/zustand/selected-chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatIdPage() {
  const pathname = usePathname();
  const [, , id] = pathname.split("/");

  const { setSelectedChat } = useSelectedChat();

  const getChat = useQuery(api.chats.getChat, { chatId: id as Id<"chats"> });

  useEffect(() => {
    if (!id || !getChat) return;

    setSelectedChat(getChat);
  }, [id, setSelectedChat, getChat]);

  return <SelectAChat />;
}
