import { Metadata } from "next";

import SignIn from "@/components/sign-in";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="min-w-svw flex min-h-svh items-center justify-center p-4">
      <SignIn />
    </div>
  );
}
