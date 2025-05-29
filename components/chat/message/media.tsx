/* eslint-disable @next/next/no-img-element */

import { MessageWithMediaState } from "@/types";
import { useImageCarousel } from "@/zustand/image-carousel";

export default function Media({ msg }: { msg: MessageWithMediaState }) {
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
