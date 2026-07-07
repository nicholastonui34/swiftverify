import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an integer amount of Kenyan Shillings, e.g. 1250 -> "KES 1,250". */
export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
