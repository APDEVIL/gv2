"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["event_manager", "participant"], {
    errorMap: () => ({ message: "Please select a role." }),
  }),
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "participant",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("Account created. Welcome!");
          router.push("/home");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Failed to create account.");
          setIsLoading(false);
        },
      },
    );
  };

  const selectedRole = form.watch("role");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Display Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your name"
                  autoComplete="name"
                  className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
            </FormItem>
          )}
        />

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
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
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

        {/* Role selector */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                I am a...
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "participant", label: "Participant", desc: "Join events" },
                    { value: "event_manager", label: "Event Manager", desc: "Create & manage" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "flex flex-col items-start rounded border p-3 text-left transition-colors",
                        selectedRole === option.value
                          ? "border-[#39FF14]/30 bg-[#39FF14]/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] uppercase tracking-wider",
                          selectedRole === option.value
                            ? "text-[#39FF14]"
                            : "text-white/50",
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-white/20">
                        {option.desc}
                      </span>
                    </button>
                  ))}
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
          Create Account
        </Button>
      </form>
    </Form>
  );
}