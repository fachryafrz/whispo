import dayjs from "dayjs";

import { Doc } from "@/convex/_generated/dataModel";

export const groupMessagesByDate = (messages: Doc<"messages">[]) => {
  return messages.reduce(
    (acc: { [key: string]: Doc<"messages">[] }, message) => {
      const dateKey = dayjs(message.sentAt).format("YYYY-MM-DD");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);

      return acc;
    },
    {},
  );
};
