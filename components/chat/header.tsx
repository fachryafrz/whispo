import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { ArrowLeft, EllipsisVertical, Search, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useEffect, useState } from "react";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatHeader() {
  const { activeChat, clearActiveChat } = useChat();

  const [mounted, setMounted] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const deleteChat = useMutation(api.chats.deleteChat);

  const interlocutorSelector = activeChat?.participants.find(
    (p) => p !== currentUser?._id,
  );
  const interlocutor = useQuery(api.users.getUserById, {
    id: interlocutorSelector as Id<"users">,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
          src={
            activeChat?.type === "private"
              ? interlocutor?.avatarUrl
              : activeChat?.imageUrl
          }
          width={40}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="text-small font-bold">
            {activeChat?.type === "private"
              ? interlocutor?.name
              : activeChat?.name}
          </h2>

          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            {activeChat?.type === "private"
              ? interlocutor?.username
              : activeChat?.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-end gap-1">
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

          {mounted && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly radius="full" variant="light">
                  <EllipsisVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Menu">
                <DropdownItem
                  key="remove"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 size={20} />}
                  onPress={() => {
                    deleteChat({ _id: activeChat?._id as Id<"chats"> });
                    clearActiveChat();
                  }}
                >
                  Remove conversation
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}
