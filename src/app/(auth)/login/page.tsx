import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-mono text-[13px] uppercase tracking-widest text-white/80">
          Sign In
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/30">
          Welcome back
        </p>
      </div>

      <LoginForm />

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-white/25">
        No account?{" "}
        <Link
          href="/register"
          className="text-[#39FF14]/70 hover:text-[#39FF14]"
        >
          Register
        </Link>
      </p>
    </div>
  );
}