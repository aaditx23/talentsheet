import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProjectsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    return projects.sort((a, b) => a.order - b.order);
  },
});

export const addProject = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    githubUrl: v.string(),
    screenshotsPath: v.optional(v.string()),
    liveLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
      
    const lastOrder = projects.reduce((max, p) => Math.max(max, p.order), -1);

    return await ctx.db.insert("projects", {
      ...args,
      order: lastOrder + 1,
    });
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    screenshotsPath: v.optional(v.string()),
    liveLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, updates);
  },
});
