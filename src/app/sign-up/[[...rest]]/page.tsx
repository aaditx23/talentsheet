"use client";

import { SignUp, StackTheme } from "@stackframe/stack";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <StackTheme>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <SignUp />
          </div>
        </div>
      </StackTheme>
    </div>
  );
}
