import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSkillsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const addSkill = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    proficiency: v.optional(v.number()), // 1-10
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("skills", args);
  },
});

export const deleteSkill = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.skillId);
  },
});
