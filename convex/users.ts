import { v } from "convex/values";

import { query } from "./_generated/server";
import { getUser } from "./utils";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

    if (!user) return;

    return user;
  },
});

export const searchByUsername = query({
  args: { usernameQuery: v.string() },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_username", (q) =>
        q.search("username", args.usernameQuery),
      )
      .take(10);

    // Filter out the current user if identity is provided
    return results.filter((u) => u.username !== user.username);
  },
});
