import { create } from "zustand";

import { ReplyToState } from "@/types";

type ReplyMessage = {
  replyMessage: ReplyToState | null;
  setReplyMessage: (message: ReplyToState) => void;
  clearReplyTo: () => void;
};

export const useReplyMessage = create<ReplyMessage>((set) => ({
  replyMessage: null,
  setReplyMessage: (message) => set({ replyMessage: message }),
  clearReplyTo: () => set({ replyMessage: null }),
}));
