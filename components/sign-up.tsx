"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import Link from "next/link";

import Logo from "./logo";

import { signUp } from "@/lib/auth-client";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="z-50 max-w-md">
      <CardHeader className="flex-col items-center gap-4">
        <Logo height={48} width={48} />
        <h1 className="text-lg font-bold md:text-xl">Sign Up</h1>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Input
                required
                id="first-name"
                label="First name"
                placeholder="Max"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Input
                required
                id="last-name"
                label="Last name"
                placeholder="Robinson"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Input
              required
              id="email"
              label="Email"
              placeholder="m@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Input
              autoComplete="new-password"
              id="password"
              label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Input
              autoComplete="new-password"
              id="password_confirmation"
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                  <Image
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                    src={imagePreview}
                  />
                </div>
              )}
              <div className="flex w-full items-center gap-2">
                <Input
                  accept="image/*"
                  className="w-full"
                  id="image"
                  label="Profile Image (optional)"
                  type="file"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            disabled={loading}
            type="submit"
            onPress={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                image: image ? await convertImageToBase64(image) : "",
                callbackURL: "/",
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    addToast({
                      color: "danger",
                      title: "Error",
                      description: ctx.error.message,
                    });
                  },
                  onSuccess: async () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Create an account"
            )}
          </Button>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <Link className="underline" href="/sign-in">
              <span className="cursor-pointer dark:text-white/70">Sign in</span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
