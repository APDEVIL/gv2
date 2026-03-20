"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Welcome back.");
          router.push("/home");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Invalid email or password.");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="border-white/[0.08] bg-white/[0.03] pr-10 font-mono text-[12px] tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[11px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : null}
          Sign In
        </Button>
      </form>
    </Form>
  );
}