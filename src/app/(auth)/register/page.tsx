import Link from "next/link";
import { RegisterForm } from "@/components/auth/regitser-form";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-mono text-[13px] uppercase tracking-widest text-white/80">
          Create Account
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/30">
          Join the arena
        </p>
      </div>

      <RegisterForm />

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-white/25">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#39FF14]/70 hover:text-[#39FF14]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}