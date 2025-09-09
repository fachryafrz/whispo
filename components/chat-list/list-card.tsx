import { Archive, Pin } from "lucide-react";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat";
import { useUser } from "@clerk/clerk-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

import ChatCard from "./card";

import { formatChatTime } from "@/lib/utils";

export function ChatListCard({
  chat,
  pinned,
  archived,
}: {
  chat: Channel;
  pinned?: boolean;
  archived?: boolean;
}) {
  const { setActiveChannel } = useChatContext();
  const { user } = useUser();

  const handleSelectChat = async () => {
    setActiveChannel(chat);

    await chat.watch({ presence: true });
  };

  const otherMember = Object.values(chat.state.members).find(
    (m) => m.user_id !== user?.username,
  );

  const message = chat.lastMessage()?.deleted_at
    ? "_message was unsent_"
    : chat.lastMessage()?.text;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ChatCard
          chatId={chat.id}
          description={
            chat.lastMessage()?.user?.id === user?.username
              ? `You: ${message}`
              : message
          }
          // hasMedia={chat.hasMedia}
          imageUrl={otherMember?.user?.image!}
          pinned={pinned}
          timeSent={
            chat.state.last_message_at
              ? formatChatTime(chat.state.last_message_at!)
              : ""
          }
          title={otherMember?.user?.name!}
          unreadCount={chat.state.unreadCount}
          onPress={handleSelectChat}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Pin chat */}
        {!archived && (
          <ContextMenuItem
            className="cursor-pointer space-x-2"
            // onClick={() => {
            //   pinChat({
            //     chatId: chat._id,
            //   });
            // }}
          >
            <Pin size={20} />
            <div>{pinned ? "Unpin" : "Pin"}</div>
          </ContextMenuItem>
        )}

        {/* Archive chat */}
        <ContextMenuItem
          className="cursor-pointer space-x-2"
          // onClick={() => {
          //   archiveChat({
          //     chatId: chat._id,
          //   });
          // }}
        >
          <Archive size={20} />
          <div>{archived ? "Unarchive" : "Archive"}</div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
