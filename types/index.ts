import { SVGProps } from "react";

import { Doc } from "@/convex/_generated/dataModel";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ReplyToState extends Doc<"chat_messages"> {
  sender: Doc<"users">;
}

export interface MessageWithMediaState extends Doc<"chat_messages"> {
  mediaUrl: string;
}
