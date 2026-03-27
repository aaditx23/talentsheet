"use client";
import { loginUser } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
     try {
         await loginUser(formData);
     } catch (e: any) {
         setError(e.message);
     }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
           <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
           <form action={handleSubmit} className="gap-4 flex flex-col">
              {error && <div className="text-red-500 text-sm p-2 bg-red-100 rounded">{error}</div>}
              <div>
                 <label className="text-sm font-medium mb-1 block">Username</label>
                 <Input name="username" required placeholder="user01" />
              </div>
              <div>
                 <label className="text-sm font-medium mb-1 block">Password</label>
                 <Input name="password" type="password" required placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full mt-2">Login</Button>
           </form>
           <div className="mt-4 text-center text-sm">
             Don't have an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
