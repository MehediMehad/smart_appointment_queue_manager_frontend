import Link from "next/link";
import Image from "next/image";
import chatLogo from "@/assets/chat.png";
import SignupForm from "@/components/pages/Signup/SignupForm";
import { AuthButtons } from "@/components/pages/Signup/AuthButtons";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border p-8 shadow-lg space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-18 h-18 mx-auto">
              <Image
                src={chatLogo}
                alt="chat logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <p className="text-muted-foreground">
              Create your account and start chatting
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <AuthButtons />

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
