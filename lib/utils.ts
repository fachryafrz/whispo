import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatChatTime(date: Date | number | string) {
  const d = dayjs(date);

  if (d.isToday()) {
    return d.format("HH:mm A");
  }

  if (d.isYesterday()) {
    return "Yesterday";
  }

  return d.format("DD/MM/YY");
}
