"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ConvexError } from "convex/values";
import { addToast } from "@heroui/toast";

import { api } from "@/convex/_generated/api";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

export default function ClientAuthorization({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const setUsernameFn = useMutation(api.auth.setUsername);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push(`/sign-in?${searchParams.toString()}`);
    } else if (isAuthenticated && isPublicPath) {
      router.push(`/?${searchParams.toString()}`);
    }
  }, [isLoading, isAuthenticated, pathname, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user === undefined) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!user?.username) {
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
  }

  return children;
}
