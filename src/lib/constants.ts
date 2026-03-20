export const EVENT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  registration_closed: "Reg. Closed",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const EVENT_STATUS_COLORS: Record<string, string> = {
  draft: "text-white/20 bg-white/[0.03] border-white/[0.06]",
  open: "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20",
  registration_closed: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  ongoing: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  completed: "text-white/40 bg-white/[0.05] border-white/10",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const PARTICIPANT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  left: "Left",
  time_over: "Time Over",
};

export const PARTICIPANT_STATUS_COLORS: Record<string, string> = {
  pending: "text-white/30 bg-white/[0.04] border-white/[0.08]",
  accepted: "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  left: "text-white/20 bg-white/[0.03] border-white/[0.06]",
  time_over: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export const ROLE_LABELS: Record<string, string> = {
  event_manager: "Event Manager",
  participant: "Participant",
};

export const LEADERBOARD_CRITERIA_LABELS: Record<string, string> = {
  points: "Points",
  wins: "Wins",
  goal_difference: "Goal Difference",
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  event_invite: "Event Invite",
  event_update: "Event Update",
  event_cancelled: "Event Cancelled",
  registration_closing_soon: "Closing Soon",
  winner_declared: "Winner Declared",
  rank_achieved: "Rank Achieved",
};

export const TEAM_MAX_SIZE = 5;

export const APP_NAME = "Arena";
export const APP_DESCRIPTION = "Gaming Leaderboard & Tournaments";