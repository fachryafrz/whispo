import { Archive, Pin } from "lucide-react";
import { ChannelPreviewUIComponentProps } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

import ChatCard from "./card";

import { formatChatTime } from "@/lib/utils";

export function ChatListCard(
  props: ChannelPreviewUIComponentProps & {
    pinned?: boolean;
    archived?: boolean;
  },
) {
  const { channel, setActiveChannel } = props;
  const { user } = useUser();

  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user_id !== user?.username,
  );

  const message = channel.lastMessage()?.deleted_at
    ? "_message was unsent_"
    : channel.lastMessage()?.text;

  const handleSelectChat = async () => {
    setActiveChannel?.(channel);

    await channel.watch({ presence: true });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ChatCard
          chatId={channel.id}
          description={
            channel.lastMessage()?.user?.id === user?.username
              ? `You: ${message}`
              : message
          }
          // hasMedia={chat.hasMedia}
          imageUrl={otherMember?.user?.image!}
          // pinned={pinned}
          timeSent={
            channel.state.last_message_at
              ? formatChatTime(channel.state.last_message_at!)
              : ""
          }
          title={otherMember?.user?.name!}
          unreadCount={channel.state.unreadCount}
          onPress={handleSelectChat}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Pin chat */}
        {!props.archived && (
          <ContextMenuItem
            className="cursor-pointer space-x-2"
            // onClick={() => {
            //   pinChat({
            //     chatId: chat._id,
            //   });
            // }}
          >
            <Pin size={20} />
            <div>{props.pinned ? "Unpin" : "Pin"}</div>
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
          <div>{props.archived ? "Unarchive" : "Archive"}</div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
