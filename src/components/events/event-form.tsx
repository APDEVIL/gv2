"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  createEventSchema,
  type CreateEventInput,
} from "@/server/lib/validations/event";

interface EventFormProps {
  defaultValues?: Partial<CreateEventInput>;
  onSubmit: (data: CreateEventInput) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function EventForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Create Event",
}: EventFormProps) {
  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      teamSize: 5,
      leaderboardCriteria: "points",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Summer Championship"
                    className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gameName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Game Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Valorant"
                    className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxTeams"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Max Teams
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Team Size
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Start Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider hover:bg-white/[0.06]",
                          !field.value && "text-white/20",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/30" />
                        {field.value
                          ? format(field.value, "MMM dd, yyyy")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto border-white/[0.08] bg-[#111] p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  End Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider hover:bg-white/[0.06]",
                          !field.value && "text-white/20",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/30" />
                        {field.value
                          ? format(field.value, "MMM dd, yyyy")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto border-white/[0.08] bg-[#111] p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Registration Deadline{" "}
                  <span className="text-white/20">(optional)</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider hover:bg-white/[0.06]",
                          !field.value && "text-white/20",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/30" />
                        {field.value
                          ? format(field.value, "MMM dd, yyyy")
                          : "No deadline"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto border-white/[0.08] bg-[#111] p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leaderboardCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Ranking Criteria
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-white/[0.08] bg-[#111]">
                    <SelectItem
                      value="points"
                      className="font-mono text-[11px] uppercase tracking-wider"
                    >
                      Points
                    </SelectItem>
                    <SelectItem
                      value="wins"
                      className="font-mono text-[11px] uppercase tracking-wider"
                    >
                      Wins
                    </SelectItem>
                    <SelectItem
                      value="goal_difference"
                      className="font-mono text-[11px] uppercase tracking-wider"
                    >
                      Goal Difference
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prize"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Prize <span className="text-white/20">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="$500 + Trophy"
                    className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Description{" "}
                  <span className="text-white/20">(optional)</span>
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Event details, rules, format..."
                    className="w-full rounded border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[12px] leading-relaxed text-white/80 placeholder:text-white/20 focus:border-[#39FF14]/30 focus:outline-none"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[11px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}