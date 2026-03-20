"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
import { NotificationPopover } from "@/components/notifications/notification-popover";
import { MobileNav } from "@/components/layout/mobile-nav";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = api.search.events.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 },
  );

  const handleSelect = (eventId: string) => {
    setQuery("");
    router.push(`/events/${eventId}`);
  };

  const showDropdown = isFocused && debouncedQuery.length >= 2;

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#0a0a0a] px-6">
      <div className="flex md:hidden">
        <MobileNav />
      </div>

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <div
          className={cn(
            "flex items-center gap-2 rounded border px-3 py-2 transition-colors",
            isFocused
              ? "border-[#39FF14]/30 bg-white/[0.04]"
              : "border-white/[0.06] bg-white/[0.02]",
          )}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-white/30" />
          <input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            className="w-full bg-transparent font-mono text-[12px] uppercase tracking-wider text-white/70 placeholder:text-white/20 focus:outline-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                className="text-white/30 hover:text-white/60"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-50 mt-1 rounded border border-white/[0.08] bg-[#111] py-1 shadow-2xl"
            >
              {isLoading ? (
                <div className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-white/30">
                  Searching...
                </div>
              ) : data?.results.length === 0 ? (
                <div className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-white/30">
                  No events found
                </div>
              ) : (
                data?.results.map((event) => (
                  <button
                    key={event.id}
                    onMouseDown={() => handleSelect(event.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex min-w-0 flex-col items-start gap-0.5">
                      <span className="truncate font-mono text-[12px] uppercase tracking-wider text-white/80">
                        {event.title}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                        {event.gameName}
                      </span>
                    </div>
                    <EventStatusBadge status={event.status} />
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <NotificationPopover />
      </div>
    </header>
  );
}