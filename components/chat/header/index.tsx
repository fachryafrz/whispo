import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { ArrowLeft, Search } from "lucide-react";
import { Avatar } from "@heroui/avatar";
import { useChatContext } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";

import Options from "./options";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function ChatHeader() {
  const { channel: selectedChat, setActiveChannel } = useChatContext();
  const { user } = useUser();

  const { setShowChatRoom } = useSelectedChat();

  const otherMember = Object.values(selectedChat!.state.members).find(
    (m) => m.user_id !== user?.username,
  );

  return (
    <div className={`p-4`}>
      <div className="flex items-center gap-2">
        {/* Back Button (Mobile) */}
        <Button
          isIconOnly
          className="md:hidden"
          radius="full"
          variant="light"
          onPress={() => {
            setShowChatRoom(false);

            setTimeout(() => {
              setActiveChannel(undefined);
            }, 500);
          }}
        >
          <ArrowLeft className="text-foreground" />
        </Button>

        {/* Avatar/Image */}
        <Avatar
          className={`[&_img]:pointer-events-none`}
          name={otherMember?.user?.name}
          src={otherMember?.user?.image}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="line-clamp-1 text-small font-bold">
            {otherMember?.user?.name}
          </h2>

          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            {otherMember?.user?.online ? "Online" : "Offline"}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-end gap-1">
          {/* Search messages */}
          <Button
            disableRipple
            isIconOnly
            radius="full"
            variant="light"
            onPress={() =>
              addToast({
                title: "Search messages",
                description:
                  "Search through your messages. This feature is coming soon.",
                color: "warning",
              })
            }
          >
            <Search className="text-foreground" size={20} />
          </Button>

          {/* Other options */}
          <Options />
        </div>
      </div>
    </div>
  );
}
