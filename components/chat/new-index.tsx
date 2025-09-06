"use client";

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
  const { channel } = useChatContext();

  return (
    <>
      {channel ? (
        <div className="grow">
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      ) : (
        <section
          className={`grid grow place-content-center bg-neutral-100 text-default-500 dark:bg-neutral-950`}
        >
          <h2 className="text-lg font-bold">Select a chat</h2>
        </section>
      )}
    </>
  );
}
