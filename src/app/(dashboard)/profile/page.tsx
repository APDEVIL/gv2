"use client";

import { api } from "@/trpc/react";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";

export default function ProfilePage() {
  const { data: user, isLoading } = api.profile.get.useQuery();

  if (isLoading) return <DetailSkeleton />;
  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account" />
      <div className="max-w-lg space-y-4">
        <ProfileCard user={user} />
        <div className="rounded border border-white/[0.06] bg-[#111] p-6">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Edit Profile
          </p>
          <ProfileForm defaultValues={{ name: user.name }} />
        </div>
      </div>
    </div>
  );
}