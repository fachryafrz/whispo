import { SVGProps } from "react";

import { Id } from "@/convex/_generated/dataModel";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Chat = {
  type: string;
  participants: string[];
  name: string;
  description: string;
  imageUrl: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: number;
  pinned?: boolean;
  unreadCount?: number;
  seenBy?: Id<"users">[];
};
