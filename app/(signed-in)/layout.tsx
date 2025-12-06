"use client";

import { Authenticated } from "convex/react";

export default function SignedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticated>{children}</Authenticated>;
}
