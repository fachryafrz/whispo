import { ChannelListMessengerProps } from "stream-chat-react";

import { useSearchUser } from "@/zustand/search-user";
import { useArchivedChats } from "@/zustand/archived-chats";
import { cn } from "@/lib/utils";

export default function List(
  props: ChannelListMessengerProps & { children?: React.ReactNode },
) {
  const { open: openSearchUser } = useSearchUser();
  const { open: openArchived } = useArchivedChats();

  return (
    <div
      className={cn(
        `relative h-full transition-all duration-500`,
        openSearchUser || openArchived ? "-translate-x-20" : "translate-x-0",
      )}
    >
      <div className={`h-full overflow-y-auto`}>{props.children}</div>
    </div>
  );
}
