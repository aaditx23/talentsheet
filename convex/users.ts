import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Public profile fetching - excludes password hash automatically
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
      
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },
});

// Secure endpoint specifically for the login Server Action
export const getUserForAuth = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Registration endpoint
export const createUser = mutation({
  args: {
    username: v.string(),
    passwordHash: v.string(),
    displayName: v.string(),
    tagline: v.string(),
    about: v.string(),
  },
  handler: async (ctx, args) => {
    // Ensure uniqueness
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
      
    if (existing) throw new Error("Username already taken.");

    return await ctx.db.insert("users", args);
  },
});

export const updateThemeSettings = mutation({
  args: {
    userId: v.id("users"),
    themeSettings: v.object({
      primary: v.string(),
      secondary: v.string(),
      background: v.string(),
      textMain: v.string(),
      accent: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { themeSettings: args.themeSettings });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    about: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
  },
});
