"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DocLogo from "@/assets/doctor-appointment.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/actions/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SigninPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);
      if (result?.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(
          result?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Demo credentials button
  const fillDemoCredentials = () => {
    form.setValue("email", "modertor@1200b.com");
    form.setValue("password", "Strong@123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/40 p-4">
      <Card className="w-full max-w-md border shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto">
            <Image
              src={DocLogo}
              alt="Appointment System Logo"
              width={90}
              height={90}
              priority
              className="rounded-full border-2 border-primary/20 shadow-md"
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            Appointment System
          </CardTitle>
          <CardDescription>
            Manage staff, services & appointments professionally
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ── Login Form ── */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-destructive text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Demo login button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={fillDemoCredentials}
            disabled={isLoading}
          >
            Use Demo Account
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
