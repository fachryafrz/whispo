"use client";

import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";

import ArchivedChats from "./archived-chats";
import ChatListHeader from "./header";
import SearchUser from "./search-user";
import List from "./list";

import { useSearchUser } from "@/zustand/search-user";
import { useStoreUserEffect } from "@/hooks/use-store-user";

export default function ChatList() {
  const { isLoading } = useStoreUserEffect();

  const { setOpen: setOpenSearchUser } = useSearchUser();

  return (
    <section
      className={`flex flex-1 flex-col bg-background md:z-10 md:min-w-96 md:max-w-96`}
    >
      <ChatListHeader />

      <div className="relative flex-1 overflow-x-hidden">
        {isLoading ? (
          <div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-2 p-4">
                {/* Avatar */}
                <Skeleton className="h-10 w-10 rounded-full" />

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <List />
        )}

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
