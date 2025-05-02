import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date in a user-friendly format
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate time remaining until a date
export function calculateTimeRemaining(endDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // Calculate total seconds between the times
  let delta = Math.abs(end.getTime() - now.getTime()) / 1000;
  
  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  
  const seconds = Math.floor(delta % 60);
  
  return { days, hours, minutes, seconds };
}

// Calculate the progress percentage for a time lock
export function calculateProgress(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  // Ensure progress is between 0 and 100
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  
  return Math.round(progress);
}

// Format asset amount with currency symbol
export function formatAsset(amount: string, assetType: string): string {
  return `${assetType} ${amount}`;
}

// Truncate wallet address for display
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Validate wallet address (basic Ethereum address validation)
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format a number with commas for readability
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
