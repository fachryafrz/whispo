import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getUser } from "./utils";

import { Chat } from "@/zustand/selected-chat";

// Chats
export const getChats = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    // Get pinned & archived chat IDs
    const [chatPinned, chatArchived] = await Promise.all([
      ctx.db
        .query("chatPinned")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
      ctx.db
        .query("chatArchived")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
    ]);

    const pinnedChatIds = chatPinned.map((c) => c.chatId);
    const archivedChatIds = chatArchived.map((c) => c.chatId);

    const userChats = await ctx.db
      .query("chatParticipants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chatIds = userChats.map((c) => c.chatId);
    const chatDocs = await Promise.all(chatIds.map((id) => ctx.db.get(id)));

    const pinned: Doc<"chats">[] = [];
    const regular: Doc<"chats">[] = [];

    for (const chat of chatDocs) {
      if (!chat || archivedChatIds.includes(chat._id)) continue;

      if (pinnedChatIds.includes(chat._id)) {
        pinned.push(chat);
      } else {
        regular.push(chat);
      }
    }

    return { pinned, regular };
  },
});

export const getChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const participants = await ctx.db
      .query("chatParticipants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId as Id<"chats">))
      .collect();

    const interlocutorId = participants.find((p) => p.userId !== user._id);

    const interlocutor = await ctx.db.get(
      interlocutorId?.userId as Id<"users">,
    );

    const chat = await ctx.db.get(args.chatId);

    return {
      chatId: chat?._id as Id<"chats">,
      type: "private",
      name: interlocutor?.name,
      description: interlocutor?.username,
      imageUrl: interlocutor?.avatarUrl,
    } as Chat;
  },
});

export const checkChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const participants = await ctx.db
      .query("chatParticipants")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId as Id<"chats">),
      )
      .collect();

    return participants.length > 0;
  },
});

export const getInterlocutor = query({
  args: {
    chatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    if (!args.chatId) return;

    const participants = await ctx.db
      .query("chatParticipants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId as Id<"chats">))
      .collect();

    const interlocutor = participants.find((p) => p.userId !== user._id);

    return await ctx.db.get(interlocutor?.userId as Id<"users">);
  },
});

export const getChatParticipants = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return [];

    const participants = await ctx.db
      .query("chatParticipants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    return await Promise.all(
      participants.map((participant) => ctx.db.get(participant.userId)),
    );
  },
});

export const selectOrStartConversation = mutation({
  args: {
    type: v.string(), // "private" or "group"
    targetId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    if (!args.targetId) return;

    // NOTE: Check if there is already a chat between the user and the target
    const existingUserChats = await ctx.db
      .query("chatParticipants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const existingChatIds = existingUserChats.map((p) => p.chatId);

    const existingTargetChats = await ctx.db
      .query("chatParticipants")
      .withIndex("by_user", (q) => q.eq("userId", args.targetId as Id<"users">))
      .collect();

    const existingTargetChatsIds = existingTargetChats.map((p) => p.chatId);

    const commonChatId = existingChatIds.find((chatId) =>
      existingTargetChatsIds.includes(chatId),
    );

    if (commonChatId) {
      // Delete unread messages
      const unreadMessages = await ctx.db
        .query("unreadMessages")
        .withIndex("by_user_chat", (q) =>
          q.eq("userId", user._id).eq("chatId", commonChatId),
        )
        .first();

      if (unreadMessages) {
        await ctx.db.delete(unreadMessages._id);
      }

      return await ctx.db.get(commonChatId);
    }

    // NOTE: If not, create a new chat
    const chatId = await ctx.db.insert("chats", {
      type: args.type,
    });

    await ctx.db.insert("chatParticipants", {
      chatId: chatId as Id<"chats">,
      userId: user._id,
    });
    await ctx.db.insert("chatParticipants", {
      chatId: chatId as Id<"chats">,
      userId: args.targetId,
    });

    return await ctx.db.get(chatId);
  },
});

// Pin a chat
export const pinChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const existing = await ctx.db
      .query("chatPinned")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    return await ctx.db.insert("chatPinned", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

// Get Archived chats
export const chatArchived = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

    if (!user) return;

    const chatPinned = await ctx.db
      .query("chatArchived")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = await Promise.all(
      chatPinned.map((pc) => ctx.db.get(pc.chatId)),
    );

    return chats;
  },
});

// Archive a chat
export const archiveChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const existing = await ctx.db
      .query("chatArchived")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    const isPinned = await ctx.db
      .query("chatPinned")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (isPinned) {
      await ctx.db.delete(isPinned._id);
    }

    return await ctx.db.insert("chatArchived", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

// NOTE: When clearing chat, this also delete "chats" table
export const clearChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .collect();

    const unreadMessages = await ctx.db
      .query("unreadMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const isPinned = await ctx.db
      .query("chatPinned")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .first();

    const isArchived = await ctx.db
      .query("chatArchived")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .first();

    const chatParticipants = await ctx.db
      .query("chatParticipants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const deletedMessages = await ctx.db
      .query("deletedMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    // Delete messages
    for (const message of messages) {
      // Delete media
      if (message?.mediaId) {
        await ctx.storage.delete(message.mediaId);
      }

      // Delete message
      await ctx.db.delete(message._id);
    }

    // Delete unread messages
    for (const unreadMessage of unreadMessages) {
      await ctx.db.delete(unreadMessage._id);
    }

    // Delete pinned chat
    if (isPinned) {
      await ctx.db.delete(isPinned._id);
    }

    // Delete archived chat
    if (isArchived) {
      await ctx.db.delete(isArchived._id);
    }

    // Delete chat participants
    for (const participant of chatParticipants) {
      await ctx.db.delete(participant._id);
    }

    // Remove deleted messages
    for (const deletedMessage of deletedMessages) {
      await ctx.db.delete(deletedMessage._id);
    }

    // Update last message to undefined
    // await ctx.db.patch(args.chatId, {
    //   lastMessage: undefined,
    //   lastMessageSender: undefined,
    //   lastMessageTime: undefined,
    // });

    return await ctx.db.delete(args.chatId);
  },
});

// Messages
export const getMessages = query({
  args: {
    chatId: v.id("chats"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return [];

    const deletedMessages = await ctx.db
      .query("deletedMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .collect();

    const deletedMessagesIds = deletedMessages.map(
      (message) => message.messageId,
    );

    const results = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .paginate(args.paginationOpts);

    const filteredPage = results.page.filter(
      (msg) => !deletedMessagesIds.includes(msg._id),
    );

    const pageWithMediaUrls = await Promise.all(
      filteredPage.map(async (msg) => {
        const replyTo = msg.replyTo && (await ctx.db.get(msg.replyTo));
        const replySender =
          replyTo?.senderId && (await ctx.db.get(replyTo.senderId));

        return {
          ...msg,
          ...(msg.senderId && {
            sender: await ctx.db.get(msg.senderId),
          }),
          ...(msg.mediaId && {
            mediaUrl: await ctx.storage.getUrl(msg.mediaId),
          }),
          ...(msg.replyTo && {
            replyTo: {
              ...replyTo,
              ...(replyTo?.senderId && {
                sender: replySender,
              }),
            },
          }),
        };
      }),
    );

    return {
      ...results,
      page: pageWithMediaUrls,
    };
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    text: v.string(),
    mediaId: v.optional(v.id("_storage")),
    replyTo: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    // Check if chat is archived
    const isArchived = await ctx.db
      .query("chatArchived")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (isArchived) {
      await ctx.db.delete(isArchived._id);
    }

    // Update chat last message
    await ctx.db.patch(args.chatId, {
      lastMessage: args.text,
      lastMessageSender: user._id,
      lastMessageTime: Date.now(),
      hasMedia: args.mediaId ? true : undefined,
    });

    // Insert message
    const message = await ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: user._id,
      text: args.text,
      replyTo: args.replyTo,
      mediaId: args.mediaId,
      sentAt: Date.now(),
    });

    return await ctx.db.get(message);
  },
});

export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    return await ctx.db.patch(args.messageId, {
      text: args.text,
      isEdited: true,
    });
  },
});

export const unsendMessage = mutation({
  args: {
    messageId: v.id("messages"),
    chatId: v.id("chats"),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    // Get message
    const message = await ctx.db.get(args.messageId);

    // Delete media if exists
    if (message?.mediaId) {
      await ctx.db.patch(args.chatId, { hasMedia: false });
      await ctx.storage.delete(message.mediaId);
      await ctx.db.patch(args.messageId, { mediaId: undefined });
    }

    // If this message is the latest, update the chat lastMessage
    if (args.index === 0) {
      await ctx.db.patch(args.chatId, {
        lastMessage: "_message was unsent_",
      });
    }

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    return await ctx.db.patch(args.messageId, {
      isUnsent: true,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    chatId: v.id("chats"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    return await ctx.db.insert("deletedMessages", {
      chatId: args.chatId,
      messageId: args.messageId,
      userId: user._id,
    });
  },
});

// Message media
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Unread messages
export const getUnreadMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    return await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();
  },
});

export const addUnreadMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        count: existing.count + args.count,
      });
    }

    return await ctx.db.insert("unreadMessages", args);
  },
});

// NOTE: Mark message as read by deleting unread message
export const readMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unreadMessages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }
  },
});
