"use server";

import { serverClient } from "@/lib/stream-server";

export const createToken = async (userId: string) => {
  const token = serverClient.createToken(userId);

  return token;
};
