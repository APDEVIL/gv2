import { Swords } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-[#39FF14]/30 bg-[#39FF14]/10">
            <Swords className="h-5 w-5 text-[#39FF14]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-white">
              Arena
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
              Gaming Leaderboard & Tournaments
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded border border-white/[0.06] bg-[#111] p-6">
          {children}
        </div>
      </div>
    </div>
  );
}