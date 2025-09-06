import dayjs from "dayjs";
import { LocalMessage } from "stream-chat";

export const groupMessagesByDate = (messages: LocalMessage[]) => {
  return messages.reduce((acc: Record<string, LocalMessage[]>, message) => {
    const dateKey = dayjs(message.created_at).format("YYYY-MM-DD");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);

    return acc;
  }, {});
};
