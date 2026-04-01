import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserByStackId = query({
  args: { stackId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stackId", (q) => q.eq("stackId", args.stackId))
      .first();

    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },
});

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

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.username.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    return {
      available: !existing,
      normalized,
    };
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

export const upsertUserFromStack = mutation({
  args: {
    stackId: v.string(),
    username: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingByStackId = await ctx.db
      .query("users")
      .withIndex("by_stackId", (q) => q.eq("stackId", args.stackId))
      .first();

    if (existingByStackId) {
      await ctx.db.patch(existingByStackId._id, {
        displayName: args.displayName || existingByStackId.displayName,
      });
      return existingByStackId._id;
    }

    const baseUsername = args.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_") || "user";
    let candidate = baseUsername;
    let suffix = 1;

    while (true) {
      const conflict = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", candidate))
        .first();

      if (!conflict) break;
      suffix += 1;
      candidate = `${baseUsername}_${suffix}`;
    }

    return await ctx.db.insert("users", {
      stackId: args.stackId,
      username: candidate,
      displayName: args.displayName,
      tagline: "Software Engineer",
      about: "Write a short introduction about yourself.",
      passwordHash: "",
    });
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

export const updateSectionLayout = mutation({
  args: {
    userId: v.id("users"),
    sectionOrder: v.array(v.string()),
    hiddenSections: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      sectionLayout: {
        sectionOrder: args.sectionOrder,
        hiddenSections: args.hiddenSections,
      },
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    about: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, username, ...updates } = args;
    const patch: any = { ...updates };

    if (username !== undefined) {
      const normalized = username.trim().toLowerCase();
      const current = await ctx.db.get(userId);
      if (!current) throw new Error("User not found");

      if (normalized !== current.username) {
        const conflict = await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", normalized))
          .first();
        if (conflict) {
          throw new Error("Username is already taken");
        }
      }

      patch.username = normalized;
    }

    await ctx.db.patch(userId, patch);
  },
});
