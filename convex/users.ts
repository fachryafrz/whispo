import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    return user;
  },
});

export const getUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.userId) return;
    
    return await ctx.db.get(args.userId);
  },
});

export const searchByUsername = query({
  args: { usernameQuery: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_username", (q) =>
        q.search("username", args.usernameQuery),
      )
      .take(10);

    // Filter out the current user if identity is provided
    if (identity) {
      return results.filter((user) => user.username !== identity.nickname);
    }

    return results;
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // throw new Error("Not authenticated");
      return;
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the data has changed, patch the value.
      await ctx.db.patch(user._id, {
        username: identity.nickname,
        avatarUrl: identity.pictureUrl,
        name: identity.name,
        email: identity.email,
      });

      return user._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      username: identity.nickname ?? "Anonymous",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      avatarUrl: identity.pictureUrl ?? "",
    });
  },
});
