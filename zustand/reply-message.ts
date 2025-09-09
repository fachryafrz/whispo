import { create } from "zustand";
import { LocalMessage } from "stream-chat";

type ReplyMessage = {
  replyMessage: LocalMessage | null;
  setReplyMessage: (message: LocalMessage) => void;
  clearReplyTo: () => void;
};

export const useReplyMessage = create<ReplyMessage>((set) => ({
  replyMessage: null,
  setReplyMessage: (message) => set({ replyMessage: message }),
  clearReplyTo: () => set({ replyMessage: null }),
}));
