"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useMutation } from "convex/react";
import { useState } from "react";
import { addToast } from "@heroui/toast";
import { ConvexError } from "convex/values";

import { api } from "@/convex/_generated/api";

export default function SetUsername() {
  const setUsernameFn = useMutation(api.auth.setUsername);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
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
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.length > 0) {
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
                // No need to redirect, state update will render children
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
