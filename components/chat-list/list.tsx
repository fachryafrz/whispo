import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import useSWR from "swr";

import { ChatListCard } from "./list-card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useArchivedChats } from "@/zustand/archived-chats";
import { streamClient } from "@/lib/stream";

const fetchChannels = async (username: string) => {
  const channels = await streamClient.queryChannels(
    { type: "messaging", members: { $in: [username] } },
    { last_message_at: -1 },
  );

  return channels;
};

export default function List() {
  const { open: openSearchUser } = useSearchUser();
  const { open: openArchived } = useArchivedChats();

  // Convex
  const chats = useQuery(api.chats.getChats);

  const { user } = useUser();

  const { data: channels } = useSWR("channels", () =>
    fetchChannels(user?.username!),
  );

  useEffect(() => {
    console.log(channels);
  }, [channels]);

  return (
    <div
      className={`relative h-full transition-all duration-500 ${openSearchUser || openArchived ? "-translate-x-20" : "translate-x-0"}`}
    >
      {/* List of chats */}
      <ul className={`h-full overflow-y-auto`}>
        {/* No chats */}
        {channels?.length === 0 && (
          <li className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
            <h2 className="text-lg font-bold">No chats</h2>
            <p className="text-sm">Start a new chat</p>
          </li>
        )}

        {/* Chats */}
        {channels?.map((channel) => (
          <li key={channel.id}>
            <ChatListCard chat={channel!} />
          </li>
        ))}
      </ul>
    </div>
  );
}
