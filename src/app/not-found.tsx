import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="font-mono text-[60px] font-bold text-white/10">404</div>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-[#39FF14]" />
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#39FF14]">
            Page not found
          </p>
          <div className="h-px w-6 bg-[#39FF14]" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/20">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/home"
          className="mt-4 rounded border border-white/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/40 transition-colors hover:border-[#39FF14]/30 hover:text-[#39FF14]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}