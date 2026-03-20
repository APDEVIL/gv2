"use client";

import { useState } from "react";
import { Menu, Swords } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[220px] border-r border-white/[0.06] bg-[#0a0a0a] p-0"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}