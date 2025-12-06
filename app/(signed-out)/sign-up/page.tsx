import { Metadata } from "next";

import SignUp from "@/components/sign-up";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up to create an account",
};

export default function SignUpPage() {
  return (
    <div className="min-w-svw flex min-h-svh items-center justify-center p-4">
      <SignUp />
    </div>
  );
}
