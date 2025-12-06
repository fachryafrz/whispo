"use client";

import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Logo from "../logo";
import SetUsername from "../set-username";

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

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.replace(`/sign-in?${searchParams.toString()}`);
    } else if (isAuthenticated && isPublicPath) {
      router.replace(`/?${searchParams.toString()}`);
    }
  }, [isLoading, isAuthenticated, pathname, searchParams]);

  return (
    <>
      <Unauthenticated>{children}</Unauthenticated>

      <Authenticated>
        {!user?.username ? <SetUsername /> : children}
      </Authenticated>

      <AuthLoading>
        <div className="flex min-h-svh items-center justify-center">
          <div className="animate-pulse">
            <Logo height={64} width={64} />
          </div>
        </div>
      </AuthLoading>
    </>
  );
}
