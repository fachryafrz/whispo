import { Archive, Pin, Trash2 } from "lucide-react";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat";
import { useSWRConfig } from "swr";
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
  const { mutate } = useSWRConfig();
  const { user } = useUser();

  const handleSelectChat = () => {
    setActiveChannel(chat);

    chat.watch({ presence: true });
  };

  const otherMember = Object.values(chat.state.members).find(
    (m) => m.user_id !== user?.username,
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ChatCard
          chatId={chat.id}
          description={
            chat.lastMessage()?.user?.id === user?.username
              ? `You: ${chat.lastMessage()?.text}`
              : chat.lastMessage()?.text
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

        {/* Delete chat */}
        <ContextMenuItem
          className="cursor-pointer space-x-2"
          onClick={async () => {
            setActiveChannel(undefined);

            await chat.delete();

            mutate("channels");
          }}
        >
          <Trash2 size={20} />
          <div>Delete</div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
