/* eslint-disable @next/next/no-img-element */

import { Doc } from "@/convex/_generated/dataModel";
import { useImageCarousel } from "@/zustand/image-carousel";

type ExtendedMessage = Doc<"chat_messages"> & { mediaUrl?: string };

export default function Media({ msg }: { msg: ExtendedMessage }) {
  const { openModal } = useImageCarousel();

  return (
    <>
      <button
        className="relative overflow-hidden rounded-md"
        onClick={() =>
          openModal({
            src: msg.mediaUrl as string,
            description: msg.text,
          })
        }
      >
        <img
          alt=""
          className="max-h-[500px] object-cover"
          draggable={false}
          src={msg.mediaUrl}
        />
      </button>
    </>
  );
}
