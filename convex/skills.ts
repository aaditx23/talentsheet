import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSkillsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return skills.sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a._creationTime - b._creationTime;
    });
  },
});

export const addSkill = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    proficiency: v.optional(v.number()), // 1-10
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const lastOrder = existing.reduce((max, skill) => Math.max(max, skill.order ?? -1), -1);

    return await ctx.db.insert("skills", {
      ...args,
      order: lastOrder + 1,
    });
  },
});

export const reorderSkills = mutation({
  args: {
    userId: v.id("users"),
    orderedSkillIds: v.array(v.id("skills")),
  },
  handler: async (ctx, args) => {
    const userSkills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const userSkillIds = new Set(userSkills.map((skill) => skill._id));
    for (const skillId of args.orderedSkillIds) {
      if (!userSkillIds.has(skillId)) {
        throw new Error("Cannot reorder skills not belonging to this user.");
      }
    }

    await Promise.all(
      args.orderedSkillIds.map((skillId, index) =>
        ctx.db.patch(skillId, { order: index }),
      ),
    );
  },
});

export const deleteSkill = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.skillId);
  },
});
