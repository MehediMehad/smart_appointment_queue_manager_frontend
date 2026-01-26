"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = (provider: "google" | "github" | "facebook") => {
    setLoading(true);
    signIn(provider, {
      callbackUrl: "/",
    }).finally(() => {
      setLoading(false);
    });
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        onClick={() => handleSignIn("google")}
        disabled={loading}
        variant="outline"
        className="h-10 text-foreground hover:bg-secondary bg-transparent"
      >
        <FcGoogle className="text-foreground" size={20} />
        Google
      </Button>
      <Button
        onClick={() => handleSignIn("github")}
        disabled={loading}
        variant="outline"
        className="h-10 text-foreground hover:bg-secondary bg-transparent"
      >
        <Github className="w-5 h-5" />
        GitHub
      </Button>
    </div>
  );
};
