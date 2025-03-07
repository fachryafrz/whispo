import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";

export default function List() {
  const { open, setOpen } = useSearchUser();
  const { setActiveChat } = useChat();

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
      {chats?.length! > 0 && (
        <ul className={`h-full overflow-y-auto`}>
          {chats?.map((chat) => (
            <li key={chat._id}>
              <ChatCard
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum
            adipisci ex blanditiis et numquam ipsa, asperiores a laudantium
            praesentium voluptatem reiciendis architecto esse delectus, error
            recusandae in! Distinctio cumque similique facere harum voluptatum
            numquam accusantium, provident possimus ipsam magnam quam quod porro
            beatae optio, voluptatibus ipsum! Quas minima nam aut."
                imageUrl={"https://i.pravatar.cc/150?u=a04258114e29026702d"}
                title={"Someone"}
                onPress={() =>
                  setActiveChat({
                    type: "private",
                    participants: ["a04258114e29026702d"],
                    name: "Someone",
                    description:
                      "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
                    imageUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  })
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
