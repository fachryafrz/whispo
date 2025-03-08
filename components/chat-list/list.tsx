import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";
import { useClerk } from "@clerk/nextjs";
import dayjs from "dayjs";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Chat } from "@/types";


export default function List() {
  const { open, setOpen } = useSearchUser();

  const chats = useQuery(api.chats.getChatsByCurrentUser);

  return (
    <div
      className={`relative h-full transition-all duration-500 ${open ? "-translate-x-20" : "translate-x-0"}`}
    >
      {/* Floating action button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Tooltip content="New chat">
          <Button
            isIconOnly
            radius="full"
            size="lg"
            onPress={() => setOpen(true)}
          >
            <Plus />
          </Button>
        </Tooltip>
      </div>

      {/* No chat */}
      {chats?.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <h2 className="text-lg font-bold">No chats</h2>
          <p className="text-sm">Start a new conversation</p>
        </div>
      )}

      {/* List of chats */}
      {/* TODO: Hide if there is no last message */}
      {chats?.length! > 0 && (
        <ul className={`h-full overflow-y-auto`}>
          {chats
            ?.sort((a, b) =>
              b.lastMessageTime && a.lastMessageTime
                ? b.lastMessageTime - a.lastMessageTime
                : b._creationTime - a._creationTime,
            )
            .map((chat) => (
              <li key={chat._id}>
                <ChatListCard chat={chat} />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function ChatListCard({ chat }: { chat: Doc<"chats"> }) {
  const { setActiveChat } = useChat();
  const { user: currentUser } = useClerk();

  const interlocutor = chat.participants.find(
    (p) => p.username !== currentUser?.username,
  );
  const storeChat = useMutation(api.chats.store);

  const handleSelectChat = () => {
    storeChat(chat as Chat);
    setActiveChat(chat as Chat);
  };

  return (
    <ChatCard
      description={chat.lastMessage}
      imageUrl={
        chat.type === "private"
          ? (interlocutor?.imageUrl ?? "")
          : (chat.imageUrl ?? "")
      }
      timeSent={
        chat.lastMessageTime
          ? new Date(chat.lastMessageTime).toString()
          : dayjs(chat._creationTime).format("HH:mm")
      }
      title={
        chat.type === "private" ? (interlocutor?.name ?? "") : (chat.name ?? "")
      }
      onPress={() => handleSelectChat()}
    />
  );
}
