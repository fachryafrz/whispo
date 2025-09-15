import { useRef, useState } from "react";
import { Button } from "@heroui/button";
import { ArrowDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import { Chip } from "@heroui/chip";
import {
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

import Message from "../message";

import { groupMessagesByDate } from "@/utils/group-messages-by-date";

const NUM_MESSAGES_TO_LOAD = 20;

export default function ChatMessages() {
  const { resolvedTheme } = useTheme();
  const { channel: selectedChat } = useChatContext();
  const { ref: loadMoreRef, inView } = useInView();
  const { messages } = useChannelStateContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  const groupedMessages = groupMessagesByDate(messages!.slice().reverse()!);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollBtn(e.currentTarget.scrollTop < 0);
  };

  // NOTE: Load more messages not working yet
  // useEffect(() => {
  //   if (inView) loadMore(NUM_MESSAGES_TO_LOAD);
  // }, [inView]);

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-15 before:dark:invert md:before:opacity-10">
      <div
        ref={containerRef}
        className="relative flex h-full flex-1 flex-col-reverse items-center overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {/* Scroll to bottom */}
        <Button
          isIconOnly
          className={`fixed z-10 bg-black text-white transition-all dark:bg-white dark:text-black ${showScrollBtn ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          radius="full"
          onPress={() => {
            containerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDown size={20} />
        </Button>

        {/* Grouped messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div
            key={date}
            className="flex w-full flex-col-reverse items-center gap-1"
          >
            {/* Messages */}
            {msgs.map((msg, index) => {
              const prevMsg = msgs[index + 1];
              const nextMsg = msgs[index - 1];

              const isDifferentSenderPrev = prevMsg?.user?.id !== msg.user?.id;
              const isDifferentSenderNext = nextMsg?.user?.id !== msg.user?.id;

              return (
                <div
                  key={msg.id} // GetStream pakai id
                  className={`w-full ${isDifferentSenderPrev ? "pt-4" : "pt-0"}`}
                >
                  {/* Message bubble */}
                  <Message
                    index={index}
                    isDifferentSenderNext={isDifferentSenderNext}
                    isDifferentSenderPrev={isDifferentSenderPrev}
                    msg={msg}
                  />
                </div>
              );
            })}

            {/* Message date */}
            <Chip className="mt-4" size="sm">
              {dayjs(date).format("dddd, DD MMMM YYYY")}
            </Chip>
          </div>
        ))}

        {/* Paginate messages */}
        {/* {status === "CanLoadMore" && (
          <div ref={loadMoreRef}>
            <Spinner color={resolvedTheme === "dark" ? "white" : "primary"} />
          </div>
        )} */}
      </div>
    </div>
  );
}
