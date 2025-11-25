import { getToken as getTokenNextjs } from "@convex-dev/better-auth/dist/commonjs/nextjs";

import { createAuth } from "@/convex/auth";

export const getToken = () => {
  return getTokenNextjs(createAuth);
};