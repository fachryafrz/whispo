"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ConvexError } from "convex/values";
import { addToast } from "@heroui/toast";

import { api } from "@/convex/_generated/api";

export default function SetUsernamePage() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const setUsernameFn = useMutation(api.auth.setUsername);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.username) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Set your username</h1>
          <p className="text-sm text-default-500">
            Choose a unique username to get started.
          </p>
        </CardHeader>
        <CardBody>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.length > 0) {
                // Trigger submit logic
                const submitBtn = document.getElementById(
                  "submit-username-btn",
                );

                if (submitBtn) submitBtn.click();
              }
            }}
          />
        </CardBody>
        <CardFooter>
          <Button
            className="w-full"
            color="primary"
            id="submit-username-btn"
            isDisabled={loading || username.length < 3}
            isLoading={loading}
            onPress={async () => {
              try {
                setLoading(true);
                await setUsernameFn({ username });
                router.push("/");
              } catch (error) {
                if (error instanceof ConvexError) {
                  addToast({
                    color: "danger",
                    title: "Error",
                    description: error.data,
                  });
                } else {
                  addToast({
                    color: "danger",
                    title: "Error",
                    description: "An unexpected error occurred",
                  });
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            Set Username
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
