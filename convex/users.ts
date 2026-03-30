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
      background: v.string(),
      foreground: v.string(),
      primary: v.string(),
      primaryForeground: v.string(),
      secondary: v.string(),
      secondaryForeground: v.string(),
      muted: v.string(),
      mutedForeground: v.string(),
      accent: v.string(),
      accentForeground: v.string(),
      card: v.string(),
      cardForeground: v.string(),
      popover: v.string(),
      popoverForeground: v.string(),
      border: v.string(),
      input: v.string(),
      ring: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { themeSettings: args.themeSettings });
  },
});

export const upsertThemePreset = mutation({
  args: {
    userId: v.id("users"),
    preset: v.object({
      name: v.string(),
      background: v.string(),
      foreground: v.string(),
      primary: v.string(),
      primaryForeground: v.string(),
      secondary: v.string(),
      secondaryForeground: v.string(),
      muted: v.string(),
      mutedForeground: v.string(),
      accent: v.string(),
      accentForeground: v.string(),
      card: v.string(),
      cardForeground: v.string(),
      popover: v.string(),
      popoverForeground: v.string(),
      border: v.string(),
      input: v.string(),
      ring: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const existing = user.themePresets ?? [];
    const normalizedName = args.preset.name.trim().toLowerCase();
    const withoutSameName = existing.filter((item) => item.name.trim().toLowerCase() !== normalizedName);

    await ctx.db.patch(args.userId, {
      themePresets: [...withoutSameName, args.preset],
    });
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
