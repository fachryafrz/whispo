"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClientAuthorization({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/sign-in?${searchParams.toString()}`);
    } else {
      router.push(`/?${searchParams.toString()}`);
    }
  }, [isLoading, isAuthenticated]);

  return children;
}
