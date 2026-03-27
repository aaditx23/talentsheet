"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const COOKIE_NAME = "portfolio_session";

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) throw new Error("Missing fields");

  const user = await convex.query(api.users.getUserForAuth as any, { username });
  
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
     throw new Error("Invalid username or password");
  }

  // Set the HTTP-Only cookie seamlessly
  const token = signToken({ username: user.username, userId: user._id });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  redirect("/dashboard");
}

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!username || !password || !displayName) throw new Error("Missing fields");

  // Custom hashing utilizing the explicit environment salt requirement
  const passwordHash = await hashPassword(password);

  try {
     const userId = await convex.mutation(api.users.createUser as any, {
       username,
       passwordHash,
       displayName,
       tagline: "Software Engineer",
       about: "I am a new user."
     });

     const token = signToken({ username, userId });
     const cookieStore = await cookies();
     cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
     });
  } catch (e: any) {
     throw new Error(e.message || "Registration failed");
  }

  redirect("/dashboard");
}

export async function logoutUser() {
   const cookieStore = await cookies();
   cookieStore.delete(COOKIE_NAME);
   redirect("/sign-in");
}

export async function getSession() {
   const cookieStore = await cookies();
   const token = cookieStore.get(COOKIE_NAME)?.value;
   if (!token) return null;
   try {
      return (await import("@/lib/auth")).verifyToken(token);
   } catch {
      return null;
   }
}
