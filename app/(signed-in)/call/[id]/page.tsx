"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Check, Copy, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CallPage() {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callignState = useCallCallingState();
  const participants = useParticipants();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleLeave = () => {
    router.push("/");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2e3);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (participants.length === 1) {
      onOpen();
    }
  }, [participants]);

  if (callignState === CallingState.JOINING) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <PhoneIcon className="animate-bounce" />
        <span>Joining call...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative grow">
        <SpeakerLayout />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
        <CallControls onLeave={handleLeave} />
      </div>

      {participants.length === 1 && (
        <div className="pointer-events-none fixed inset-0 grid place-content-center p-4 xl:inset-auto xl:bottom-0 xl:left-0 [&_*]:pointer-events-auto">
          <div className="max-w-md space-y-6 rounded-2xl bg-foreground-50 p-8">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <Copy className="h-8 w-8" />
            </div>

            {/* Text */}
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Waiting for others to join</h2>
              <p className="text-foreground-500">
                Share this link with others to invite them to the call
              </p>
            </div>

            {/* Button */}
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <span className="grow break-all font-mono text-sm text-foreground-500">
                {window.location.href}
              </span>

              <Button
                className="shrink-0"
                startContent={
                  copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )
                }
                onPress={copyToClipboard}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* {participants.length === 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Copy className="h-8 w-8 text-blue-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Waiting for others to join
                </h2>
                <p className="text-gray-600">
                  Share this link with others to invite them to the call
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grow break-all font-mono text-sm text-gray-700">
                    {window.location.href}
                  </div>

                  <button
                    className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    type="button"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
