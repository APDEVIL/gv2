"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
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
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/server/lib/validations/profile";

interface ProfileFormProps {
  defaultValues: {
    name: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const utils = api.useUtils();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const { mutate, isPending } = api.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      void utils.profile.get.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-5"
      >
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
                  className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-wider" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || !form.formState.isDirty}
          className="w-full border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[11px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
        >
          {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}