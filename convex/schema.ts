import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(), // SLUG for routing e.g., 'user01'
    displayName: v.string(),
    tagline: v.string(),
    about: v.string(),
    passwordHash: v.string(),
    themeSettings: v.optional(v.object({
      primary: v.string(),
      secondary: v.string(),
      background: v.string(),
      textMain: v.string(),
      accent: v.string(),
    })),
  }).index("by_username", ["username"]),

  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    proficiency: v.optional(v.number()), // 1-10
  }).index("by_userId", ["userId"]),
  
  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.string(), 
    description: v.string(), 
    githubUrl: v.string(), 
    screenshotsPath: v.optional(v.string()),
    liveLink: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),

  cvs: defineTable({
    userId: v.id("users"),
    cvName: v.string(),       
    isActive: v.boolean(),    
    profileStatement: v.string(),
    sectionOrder: v.array(v.string()),
    
    experiences: v.array(v.object({
      company: v.string(),
      duration: v.string(),
      role: v.string(),
      location: v.string(),
      bulletPoints: v.array(v.string())
    })),

    education: v.array(v.object({
        institution: v.string(),
        duration: v.string(),
        degree: v.string(),
        location: v.string(),
    })),
    selectedProjectIds: v.array(v.id("projects")),
  }).index("by_userId", ["userId"]),
});
