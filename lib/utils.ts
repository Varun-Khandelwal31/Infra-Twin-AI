import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amountLakhs: number): string {
  if (amountLakhs >= 100) {
    return `₹${(amountLakhs / 100).toFixed(2)} Cr`;
  }
  return `₹${amountLakhs.toFixed(2)} Lakhs`;
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
