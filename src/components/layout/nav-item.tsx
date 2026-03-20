"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link href={href}>
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
        <Icon
          className={cn(
            "h-4 w-4 flex-shrink-0 transition-colors",
            isActive
              ? "text-[#39FF14]"
              : "text-white/30 group-hover:text-white/50",
          )}
        />
        <span className="font-mono text-[11px] uppercase tracking-wider">
          {label}
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
}