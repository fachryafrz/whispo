"use client";

import { Button } from "@heroui/button";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = () => {
    setMessages((prev) => [`Message ${prev.length}`, ...prev]); // Tambah ke awal array
  };

  return (
    <section className={`flex flex-1 flex-col bg-neutral-900`}>
      {/* Header */}
      <div className={`p-4`}>Header</div>

      {/* Chat */}
      <div
        className={`flex flex-1 flex-col-reverse items-center overflow-y-auto bg-neutral-800`}
      >
        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`p-4 flex-1 w-full`}>
            {msg}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={`p-4`}>
        <Button onPress={addMessage}>Send</Button>
      </div>
    </section>
  );
}
