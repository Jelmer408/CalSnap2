import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(calories: number): string {
  return new Intl.NumberFormat('en-US').format(calories);
}

export function formatWeight(weight: number, unit: 'kg' | 'lbs'): string {
  return `${weight.toFixed(1)} ${unit}`;
}

export function calculateProgress(current: number, goal: number): number {
  return Math.min(Math.round((current / goal) * 100), 100);
}
