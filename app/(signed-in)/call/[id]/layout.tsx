"use client";

import { useUser } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PhoneIcon, ShieldAlert } from "lucide-react";
import { useQuery } from "convex/react";
import { Button } from "@heroui/button";

import { createToken } from "@/actions/create-token";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("Missing Stream API key");
}

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const checkChat = useQuery(api.chats.checkChat, {
    chatId: id as Id<"chats">,
  });
  const router = useRouter();

  const tokenProvider = useCallback(async () => {
    if (!user?.username) {
      throw new Error("User not found");
    }

    return await createToken(user.username);
  }, [user?.username]);

  useEffect(() => {
    if (!user) {
      setClient(null);

      return;
    }

    const newClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: user.username as string,
        name: user.fullName || "Anonymous",
        image: user.imageUrl as string,
      },
      tokenProvider,
    });

    setClient(newClient);

    return () => {
      newClient.disconnectUser();
    };
  }, [user, tokenProvider]);

  useEffect(() => {
    if (!client || !id || !checkChat) return;

    setError(null);
    const streamCall = client.call("default", id as string);

    const joinCall = async () => {
      try {
        await streamCall.join({ create: true });

        if (searchParams.get("video") === "true") {
          await streamCall.camera.enable();
        } else {
          await streamCall.camera.disable();
        }

        setCall(streamCall);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to join call",
        );
      }
    };

    joinCall();

    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave();
      }
    };
  }, [client, id, searchParams, checkChat]);

  if (!checkChat) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <ShieldAlert />
        <span>Chat not found</span>
        <Button onPress={() => router.push("/")}>Go back</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <PhoneIcon className="animate-bounce" />
        <span>Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <ShieldAlert />
        <span>{error}</span>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <PhoneIcon className="animate-bounce" />
        <span>Calling...</span>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>{children}</StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}
