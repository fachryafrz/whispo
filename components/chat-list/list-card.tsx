import { Archive, Pin } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

import ChatCard from "./card";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Chat, useSelectedChat } from "@/zustand/selected-chat";
import { formatChatTime } from "@/lib/utils";

export function ChatListCard({
  chat,
  pinned,
  archived,
}: {
  chat: Doc<"chats">;
  pinned?: boolean;
  archived?: boolean;
}) {
  const router = useRouter();

  const { setSelectedChat } = useSelectedChat();

  // Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const getChat = useQuery(api.chats.getChat, {
    chatId: chat._id,
  });
  const interlocutor = useQuery(api.chats.getInterlocutor, {
    chatId: chat._id,
  });
  const pinChat = useMutation(api.chats.pinChat);
  const archiveChat = useMutation(api.chats.archiveChat);
  const unreadMessages = useQuery(api.chats.getUnreadMessages, {
    chatId: chat._id as Id<"chats">,
  });
  const readMessage = useMutation(api.chats.readMessage);

  const handleSelectChat = () => {
    setSelectedChat(getChat as Chat);

    readMessage({
      chatId: chat._id as Id<"chats">,
      userId: currentUser?._id as Id<"users">,
    });

    router.push(`/chat/${chat._id}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ChatCard
          chatId={chat._id}
          description={
            chat.lastMessageSender === currentUser?._id
              ? `You: ${chat.lastMessage}`
              : chat.lastMessage
          }
          hasMedia={chat.hasMedia}
          imageUrl={
            chat.type === "private"
              ? (interlocutor?.avatarUrl ?? "")
              : (chat.imageUrl ?? "")
          }
          pinned={pinned}
          timeSent={formatChatTime(chat.lastMessageTime!)}
          title={
            chat.type === "private"
              ? (interlocutor?.name ?? "")
              : (chat.name ?? "")
          }
          unreadCount={unreadMessages?.count}
          onPress={handleSelectChat}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Pin chat */}
        {!archived && (
          <ContextMenuItem
            className="cursor-pointer space-x-2"
            onClick={() => {
              pinChat({
                chatId: chat._id,
              });
            }}
          >
            <Pin size={20} />
            <div>{pinned ? "Unpin" : "Pin"}</div>
          </ContextMenuItem>
        )}

        {/* Archive chat */}
        <ContextMenuItem
          className="cursor-pointer space-x-2"
          onClick={() => {
            archiveChat({
              chatId: chat._id,
            });
          }}
        >
          <Archive size={20} />
          <div>{archived ? "Unarchive" : "Archive"}</div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
