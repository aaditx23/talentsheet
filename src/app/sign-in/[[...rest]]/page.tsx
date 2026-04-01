"use client";

import { SignIn, StackTheme } from "@stackframe/stack";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <StackTheme>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <SignIn />
          </div>
        </div>
      </StackTheme>
    </div>
  );
}
