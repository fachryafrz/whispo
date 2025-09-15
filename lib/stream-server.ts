import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET_KEY;

if (!apiKey) {
  throw new Error("Missing Stream API key");
}

if (!apiSecret) {
  throw new Error("Missing Stream API secret key");
}

export const serverClient = StreamChat.getInstance(apiKey, apiSecret);
