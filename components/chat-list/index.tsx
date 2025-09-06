"use client";

import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";

import ArchivedChats from "./archived-chats";
import ChatListHeader from "./header";
import SearchUser from "./search-user";
import List from "./list";

import { useSearchUser } from "@/zustand/search-user";

export default function ChatList() {
  const { setOpen: setOpenSearchUser } = useSearchUser();

  return (
    <section
      className={`flex flex-1 flex-col bg-background md:z-10 md:min-w-96 md:max-w-96`}
    >
      <ChatListHeader />

      <div className="relative flex-1 overflow-x-hidden">
        <List />

        {/* Floating action button */}
        <div className="absolute bottom-4 right-4 z-10">
          <Tooltip content="New chat">
            <Button
              isIconOnly
              className="h-14 w-14"
              radius="full"
              size="lg"
              onPress={() => setOpenSearchUser(true)}
            >
              <Plus />
            </Button>
          </Tooltip>
        </div>

        <SearchUser />

        <ArchivedChats />
      </div>
    </section>
  );
}
