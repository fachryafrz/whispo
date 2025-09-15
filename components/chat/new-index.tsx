"use client";

import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";

import ChatHeader from "./header";
import ChatInput from "./input";

export default function Chat() {
  const { channel, setActiveChannel } = useChatContext();

  return (
    <>
      {channel ? (
        <div className="absolute inset-0 md:static md:grow">
          <Channel>
            <Window>
              <ChatHeader />
              <div className="relative overflow-y-hidden bg-background before:pointer-events-none before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-15 before:dark:invert md:before:opacity-10">
                <MessageList />
              </div>
              <MessageInput Input={ChatInput} />
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
