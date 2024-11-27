import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const romanToNumber = (roman: string): number => {
    const map: Record<string, number> = {
        I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    };
    let num = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        const value = map[roman[i]];
        num += value < prevValue ? -value : value;
        prevValue = value;
    }
    return num;
};
