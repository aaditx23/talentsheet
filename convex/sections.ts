import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function nextOrderForTable(
  ctx: any,
  table:
    | "experiences"
    | "educationEntries"
    | "achievements"
    | "certifications"
    | "extracurriculars",
  userId: any,
) {
  const items = await ctx.db.query(table).withIndex("by_userId", (q: any) => q.eq("userId", userId)).collect();
  return items.reduce((max: number, item: any) => Math.max(max, item.order ?? -1), -1) + 1;
}

function sortByOrder<T extends { order: number; _creationTime: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a._creationTime - b._creationTime);
}

export const getExperiencesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("experiences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return sortByOrder(items as any);
  },
});

export const addExperience = mutation({
  args: {
    userId: v.id("users"),
    company: v.string(),
    role: v.string(),
    duration: v.string(),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await nextOrderForTable(ctx, "experiences", args.userId);
    return ctx.db.insert("experiences", { ...args, order });
  },
});

export const deleteExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getEducationEntriesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("educationEntries")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return sortByOrder(items as any);
  },
});

export const addEducationEntry = mutation({
  args: {
    userId: v.id("users"),
    institution: v.string(),
    degree: v.string(),
    duration: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await nextOrderForTable(ctx, "educationEntries", args.userId);
    return ctx.db.insert("educationEntries", { ...args, order });
  },
});

export const deleteEducationEntry = mutation({
  args: { id: v.id("educationEntries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getAchievementsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("achievements")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return sortByOrder(items as any);
  },
});

export const addAchievement = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    issuer: v.optional(v.string()),
    date: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await nextOrderForTable(ctx, "achievements", args.userId);
    return ctx.db.insert("achievements", { ...args, order });
  },
});

export const deleteAchievement = mutation({
  args: { id: v.id("achievements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getCertificationsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("certifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return sortByOrder(items as any);
  },
});

export const addCertification = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    issuer: v.optional(v.string()),
    issueDate: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await nextOrderForTable(ctx, "certifications", args.userId);
    return ctx.db.insert("certifications", { ...args, order });
  },
});

export const deleteCertification = mutation({
  args: { id: v.id("certifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getExtracurricularsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("extracurriculars")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return sortByOrder(items as any);
  },
});

export const addExtracurricular = mutation({
  args: {
    userId: v.id("users"),
    organization: v.string(),
    role: v.string(),
    duration: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await nextOrderForTable(ctx, "extracurriculars", args.userId);
    return ctx.db.insert("extracurriculars", { ...args, order });
  },
});

export const deleteExtracurricular = mutation({
  args: { id: v.id("extracurriculars") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
