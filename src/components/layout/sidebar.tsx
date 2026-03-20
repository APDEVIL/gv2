"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Swords,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/server/better-auth/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const managerNav = [
  {
    label: "Home",
    href: "/home",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    href: "/events",
    icon: Swords,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

const participantNav = [
  {
    label: "Home",
    href: "/home",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    href: "/events",
    icon: Shield,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isManager } = useRole();
  const { session } = useSession();
  const router = useRouter();

  const navItems = isManager ? managerNav : participantNav;

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

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-[#39FF14]/30 bg-[#39FF14]/10">
          <Swords className="h-3.5 w-3.5 text-[#39FF14]" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            Arena
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
            {isManager ? "Manager Console" : "Player Hub"}
          </span>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
            isManager
              ? "bg-[#39FF14]/10 text-[#39FF14]"
              : "bg-blue-500/10 text-blue-400",
          )}
        >
          {isManager ? (
            <Shield className="h-3 w-3" />
          ) : (
            <Users className="h-3 w-3" />
          )}
          {isManager ? "Event Manager" : "Participant"}
        </div>
      </div>

      <Separator className="bg-white/[0.04]" />

      {/* Nav items */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-0.5 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "group flex items-center gap-3 rounded px-3 py-2.5 transition-colors",
                    isActive
                      ? "bg-white/[0.07] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive ? "text-[#39FF14]" : "text-white/30 group-hover:text-white/50",
                    )}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto h-1 w-1 rounded-full bg-[#39FF14]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/[0.04]" />

      {/* Profile + logout */}
      <div className="p-3">
        <Link href="/profile">
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "group flex items-center gap-3 rounded px-3 py-2.5 transition-colors",
              pathname === "/profile"
                ? "bg-white/[0.07] text-white"
                : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
            )}
          >
            <Avatar className="h-5 w-5 border border-white/10">
              <AvatarFallback className="bg-white/10 font-mono text-[9px] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-mono text-[11px] uppercase tracking-wider text-white/70">
                {session?.user?.name ?? "Profile"}
              </span>
            </div>
            <ChevronRight className="ml-auto h-3 w-3 text-white/20 group-hover:text-white/40" />
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
    </aside>
  );
}