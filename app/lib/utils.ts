import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Line {
    nomcourtligne: string;
}

export function sortLines(a: Line, b: Line): number {
    if (a.nomcourtligne.includes("C") && !b.nomcourtligne.includes("C")) return -1;
    if (!a.nomcourtligne.includes("C") && b.nomcourtligne.includes("C")) return 1;
    if (a.nomcourtligne.length !== b.nomcourtligne.length) {
        return a.nomcourtligne.length - b.nomcourtligne.length;
    }
    return a.nomcourtligne.localeCompare(b.nomcourtligne);
}
