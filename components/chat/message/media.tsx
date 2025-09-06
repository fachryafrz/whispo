/* eslint-disable @next/next/no-img-element */

import { LocalMessage } from "stream-chat";

import { useImageCarousel } from "@/zustand/image-carousel";


export default function Media({ msg }: { msg: LocalMessage }) {
  const { openModal } = useImageCarousel();

  return (
    <>
      <button
        className="relative overflow-hidden rounded-md"
        onClick={() =>
          openModal({
            src: msg.attachments![0].image_url as string,
            description: msg.text,
          })
        }
      >
        <img
          alt=""
          className="max-h-[500px] object-cover"
          draggable={false}
          src={msg.attachments![0].image_url}
        />
      </button>
    </>
  );
}
