import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM dd, yyyy · HH:mm");
}

export function formatTimeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), "MMM dd");
}

export function isDeadlinePassed(deadline: Date | string | null): boolean {
  if (!deadline) return false;
  return isBefore(new Date(deadline), new Date());
}

export function getDeadlineLabel(deadline: Date | string | null): string {
  if (!deadline) return "No deadline";

  const date = new Date(deadline);
  const now = new Date();

  if (isBefore(date, now)) return "Registration closed";

  const hoursLeft = differenceInHours(date, now);
  if (hoursLeft < 1) return "Closes in less than an hour";
  if (hoursLeft < 24) return `Closes in ${hoursLeft}h`;

  const daysLeft = differenceInDays(date, now);
  return `Closes in ${daysLeft}d`;
}

export function isEventActive(
  startTime: Date | string,
  endTime: Date | string,
): boolean {
  const now = new Date();
  return (
    isAfter(now, new Date(startTime)) && isBefore(now, new Date(endTime))
  );
}