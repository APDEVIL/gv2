"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disablePast?: boolean;
  clearable?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  disablePast = false,
  clearable = false,
}: DatePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "flex-1 justify-start border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider hover:bg-white/[0.06] disabled:opacity-40",
              !value && "text-white/20",
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/30" />
            {value ? format(value, "MMM dd, yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-white/[0.08] bg-[#111] p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disablePast ? (date) => date < new Date() : undefined}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {clearable && value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(undefined)}
          className="h-9 w-9 text-white/20 hover:text-white/50"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}