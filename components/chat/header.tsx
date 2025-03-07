import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { ArrowLeft, Search } from "lucide-react";

import { useChat } from "@/zustand/chat";

export default function ChatHeader() {
  const { activeChat, setActiveChat, clearActiveChat } = useChat();

  return (
    <div className={`p-4`}>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="md:hidden"
          radius="full"
          variant="light"
          onPress={() => clearActiveChat()}
        >
          <ArrowLeft />
        </Button>

        {/* Avatar/Image */}
        <Image
          alt="avatar"
          draggable={false}
          height={40}
          radius="full"
          src={activeChat?.imageUrl}
          width={40}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="text-small font-bold">{activeChat?.name}</h2>
          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            {activeChat?.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-end gap-1">
          <Button
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
            <Search size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
