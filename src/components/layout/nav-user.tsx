"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export function NavUser() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSession();

  const name = session?.user?.name ?? "Profile";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isProfileActive = pathname === "/profile";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully.");
          router.push("/login");
        },
        onError: () => {
          toast.error("Failed to log out. Please try again.");
        },
      },
    });
  };

  return (
    <div className="p-3">
      <Separator className="mb-3 bg-white/[0.04]" />

      <Link href="/profile">
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "group flex items-center gap-3 rounded px-3 py-2.5 transition-colors",
            isProfileActive
              ? "bg-white/[0.07] text-white"
              : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
          )}
        >
          <Avatar className="h-5 w-5 flex-shrink-0 border border-white/10">
            <AvatarFallback className="bg-white/10 font-mono text-[9px] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-wider text-white/70">
            {name}
          </span>
          <ChevronRight className="h-3 w-3 flex-shrink-0 text-white/20 group-hover:text-white/40" />
        </motion.div>
      </Link>

      <motion.button
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
        onClick={handleLogout}
        className="mt-0.5 flex w-full items-center gap-3 rounded px-3 py-2.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-4 w-4 flex-shrink-0" />
        <span className="font-mono text-[11px] uppercase tracking-wider">
          Logout
        </span>
      </motion.button>
    </div>
  );
}