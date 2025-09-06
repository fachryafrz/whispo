"use client";

import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";

export default function Chat() {
  const { channel, setActiveChannel } = useChatContext();

  return (
    <>
      {channel ? (
        <div className="absolute inset-0 md:static md:grow">
          <Channel>
            <Window>
              <div className="flex items-center px-2">
                <Button
                  isIconOnly
                  className="border-0 md:hidden"
                  radius="full"
                  variant="ghost"
                  onPress={() => setActiveChannel(undefined)}
                >
                  <ArrowLeft />
                </Button>

                <ChannelHeader />
              </div>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      ) : (
        <section
          className={`hidden h-full place-content-center bg-neutral-100 text-default-500 dark:bg-neutral-950 md:grid md:grow`}
        >
          <h2 className="text-lg font-bold">Select a chat</h2>
        </section>
      )}
    </>
  );
}
