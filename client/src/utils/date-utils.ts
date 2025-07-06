/**
 * Utility functions for date formatting and calculations
 */

/**
 * Format a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate time remaining until a target date
 * @param endDate The target date
 * @returns Object with days, hours, minutes, seconds remaining
 */
export function calculateTimeRemaining(endDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // Calculate the time difference in milliseconds
  const diff = Math.max(0, end.getTime() - now.getTime());
  
  // Convert to days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(diff / 1000);
  
  return { days, hours, minutes, seconds, totalSeconds };
}

/**
 * Calculate progress between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // Calculate total duration and elapsed time
  const totalDuration = end.getTime() - start.getTime();
  const elapsedDuration = now.getTime() - start.getTime();
  
  // Calculate and clamp progress percentage between 0-100
  const progress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  
  return progress;
}

/**
 * Check if a date is in the past
 * @param date The date to check
 * @returns True if the date is in the past
 */
export function isDateInPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Format a duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param date The date to compare with now
 * @returns Relative time string
 */
export function getRelativeTimeString(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (diffSeconds < 0) {
    // Past
    if (diffSeconds > -60) return 'just now';
    if (diffMinutes > -60) return `${Math.abs(diffMinutes)} minutes ago`;
    if (diffHours > -24) return `${Math.abs(diffHours)} hours ago`;
    if (diffDays > -30) return `${Math.abs(diffDays)} days ago`;
    return formatDate(dateObj);
  } else {
    // Future
    if (diffSeconds < 60) return 'in a few seconds';
    if (diffMinutes < 60) return `in ${diffMinutes} minutes`;
    if (diffHours < 24) return `in ${diffHours} hours`;
    if (diffDays < 30) return `in ${diffDays} days`;
    return formatDate(dateObj);
  }
}

/**
 * Format asset amount with currency symbol
 * @param amount The amount as a string
 * @param assetType The type of asset/currency
 * @returns Formatted asset string
 */
export function formatAsset(amount: string, assetType: string): string {
  return `${assetType} ${amount}`;
}

/**
 * Truncate wallet address for display
 * @param address The wallet address to truncate
 * @param startLength Number of characters to show at the start
 * @param endLength Number of characters to show at the end
 * @returns Truncated address
 */
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Validate wallet address (basic Ethereum address validation)
 * @param address The address to validate
 * @returns True if the address is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format a number with commas for readability
 * @param num The number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format the time left until a target date in a human-readable format
 * @param endDate The target date
 * @returns Formatted time string (e.g., "2 days 3 hours", "10 months")
 */
export function formatTimeLeft(endDate: Date | string): string {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // If the date is in the past, return "Unlocked"
  if (end <= now) {
    return "Unlocked";
  }
  
  // Calculate the difference in milliseconds
  const diff = end.getTime() - now.getTime();
  
  // Convert to various time units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  // Format based on the largest appropriate unit
  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}${months % 12 > 0 ? ` ${months % 12} ${months % 12 === 1 ? 'month' : 'months'}` : ''}`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}${days % 30 > 0 ? ` ${days % 30} ${days % 30 === 1 ? 'day' : 'days'}` : ''}`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}${hours % 24 > 0 ? ` ${hours % 24} ${hours % 24 === 1 ? 'hour' : 'hours'}` : ''}`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}${minutes % 60 > 0 ? ` ${minutes % 60} ${minutes % 60 === 1 ? 'min' : 'mins'}` : ''}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
}