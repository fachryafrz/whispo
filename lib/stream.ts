import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

if (!apiKey) {
  throw new Error("Missing Stream API key");
}

export const streamClient = StreamChat.getInstance(apiKey);
