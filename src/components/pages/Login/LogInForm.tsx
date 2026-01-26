"use client";

import { Eye, Lock, Mail } from "lucide-react";
import { Input } from "../../ui/input";
import { useState } from "react";
import { Button } from "../../ui/button";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/actions/auth";
import { SweetAlert2 } from "../../shared/core/Alert/sweetalert2";
import { loginSchema } from "@/validation/auth.validation";

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  // 2. useForm initialization
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // defaultValues
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting, isLoading },
  } = form;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      // setIsLoading(true);
      const res = await loginAction(values);

      if (res.success) {
        await SweetAlert2(`Welcome back, ${res.data.name}!`, "success");
      } else {
        await SweetAlert2(res.message, "error");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      await SweetAlert2(error.message || "Something went wrong", "error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email" // schema field name
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="pl-10 h-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage /> {/* Validation message */}
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password" // schema field name
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <div
                  className="cursor-pointer absolute right-3 top-3 w-5 h-5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye />
                </div>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="password"
                    className="pl-10 h-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage /> {/* Validation message */}
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading || isSubmitting}
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
