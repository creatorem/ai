import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * @name cn
 * @description Merge classes together
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}