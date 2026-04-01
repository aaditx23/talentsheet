import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    stackId: v.optional(v.string()),
    username: v.string(), // SLUG for routing e.g., 'user01'
    displayName: v.string(),
    tagline: v.string(),
    about: v.string(),
    passwordHash: v.string(),
    themeSettings: v.optional(v.object({
      background: v.string(),
      foreground: v.optional(v.string()),
      primary: v.string(),
      primaryForeground: v.optional(v.string()),
      secondary: v.string(),
      secondaryForeground: v.optional(v.string()),
      muted: v.optional(v.string()),
      mutedForeground: v.optional(v.string()),
      accent: v.string(),
      accentForeground: v.optional(v.string()),
      card: v.optional(v.string()),
      cardForeground: v.optional(v.string()),
      popover: v.optional(v.string()),
      popoverForeground: v.optional(v.string()),
      border: v.optional(v.string()),
      input: v.optional(v.string()),
      ring: v.optional(v.string()),

      // Legacy fields retained for backward compatibility.
      textMain: v.optional(v.string()),
      textMuted: v.optional(v.string()),
    })),
    themePresets: v.optional(v.array(v.object({
      name: v.string(),
      background: v.string(),
      foreground: v.optional(v.string()),
      primary: v.string(),
      primaryForeground: v.optional(v.string()),
      secondary: v.string(),
      secondaryForeground: v.optional(v.string()),
      muted: v.optional(v.string()),
      mutedForeground: v.optional(v.string()),
      accent: v.string(),
      accentForeground: v.optional(v.string()),
      card: v.optional(v.string()),
      cardForeground: v.optional(v.string()),
      popover: v.optional(v.string()),
      popoverForeground: v.optional(v.string()),
      border: v.optional(v.string()),
      input: v.optional(v.string()),
      ring: v.optional(v.string()),

      // Legacy fields retained for backward compatibility.
      textMain: v.optional(v.string()),
      textMuted: v.optional(v.string()),
    }))),
    sectionLayout: v.optional(v.object({
      sectionOrder: v.array(v.string()),
      hiddenSections: v.array(v.string()),
    })),
  }).index("by_username", ["username"]).index("by_stackId", ["stackId"]),

  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    proficiency: v.optional(v.number()), // 1-10
    order: v.optional(v.number()),
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

  experiences: defineTable({
    userId: v.id("users"),
    company: v.string(),
    role: v.string(),
    duration: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    isPresent: v.optional(v.boolean()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),

  educationEntries: defineTable({
    userId: v.id("users"),
    institution: v.string(),
    degree: v.string(),
    subject: v.optional(v.string()),
    duration: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    isPresent: v.optional(v.boolean()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),

  achievements: defineTable({
    userId: v.id("users"),
    title: v.string(),
    issuer: v.optional(v.string()),
    date: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),

  certifications: defineTable({
    userId: v.id("users"),
    name: v.string(),
    issuer: v.optional(v.string()),
    issueDate: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),

  extracurriculars: defineTable({
    userId: v.id("users"),
    organization: v.string(),
    role: v.string(),
    duration: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    isPresent: v.optional(v.boolean()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_userId", ["userId"]),
});
