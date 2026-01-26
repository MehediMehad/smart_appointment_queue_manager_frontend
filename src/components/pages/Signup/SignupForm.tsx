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
import { SweetAlert2 } from "../../shared/core/Alert/sweetalert2";
import { registerSchema } from "@/validation/auth.validation";
import { signupAction } from "@/actions/auth";

type SignupFormValues = z.infer<typeof registerSchema>;

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  // 2. useForm initialization
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
    // defaultValues
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting, isLoading },
  } = form;

  const onSubmit = async (values: SignupFormValues) => {
    const singUpData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const res = await signupAction(singUpData);

      if (res.success) {
        await SweetAlert2(`Thank for joining us`, "success");
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
        {/* Full Name */}
        <FormField
          control={form.control}
          name="name" // schema field name
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* Validation message */}
            </FormItem>
          )}
        />

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

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword" // schema field name
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
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
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
