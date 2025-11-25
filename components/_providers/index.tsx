"use client";

import { ConvexClientProvider } from "../convex-client-provider";

import ClientAuthorization from "./client-authorization";
import { ThemeProviders } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviders themeProps={{ attribute: "class", defaultTheme: "dark" }}>
      <ConvexClientProvider>
        <ClientAuthorization>{children}</ClientAuthorization>
      </ConvexClientProvider>
    </ThemeProviders>
  );
}
