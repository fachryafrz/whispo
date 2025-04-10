"use client";

import ArchivedChats from "./archived-chats";
import ChatListHeader from "./header";
import List from "./list";
import SearchUser from "./search-user";

import { useStoreUserEffect } from "@/hooks/use-store-user";

export default function ChatList() {
  useStoreUserEffect();

  return (
    <section
      className={`flex flex-1 flex-col bg-white dark:bg-black md:z-10 md:max-w-96`}
    >
      <ChatListHeader />

      <div className="relative flex-1 overflow-x-hidden">
        <List />

        <SearchUser />

        <ArchivedChats />
      </div>
    </section>
  );
}
