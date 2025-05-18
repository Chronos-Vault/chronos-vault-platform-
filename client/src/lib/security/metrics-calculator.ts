/**
 * Security Metrics Calculator
 * 
 * This class provides methods to calculate security scores and metrics
 * based on vault configuration parameters.
 */
export class MetricsCalculator {
  /**
   * Calculate a security score based on various security factors
   */
  calculateSecurityScore(factors: Record<string, number>): number {
    return Object.values(factors).reduce((sum, value) => sum + value, 0);
  }

  /**
   * Get a descriptive security level based on a numeric score
   */
  getSecurityLevel(score: number): string {
    if (score >= 90) return 'Maximum';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Enhanced';
    if (score >= 30) return 'Standard';
    return 'Basic';
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 20;
    else if (password.length >= 8) score += 10;
    else if (password.length >= 6) score += 5;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 10; // Uppercase
    if (/[a-z]/.test(password)) score += 10; // Lowercase
    if (/[0-9]/.test(password)) score += 10; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 10; // Special characters
    
    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) score += 10; // No character repeats 3+ times
    if (!/123|234|345|456|567|678|789/.test(password)) score += 10; // No sequential numbers
    if (!/abc|bcd|cde|def|efg/.test(password.toLowerCase())) score += 10; // No sequential letters
    
    return Math.min(100, score);
  }

  /**
   * Evaluate the time required to brute force a password
   */
  estimatePasswordCrackTime(password: string): string {
    if (!password) return "Instant";
    
    const length = password.length;
    let characterSet = 0;
    
    if (/[a-z]/.test(password)) characterSet += 26;
    if (/[A-Z]/.test(password)) characterSet += 26;
    if (/[0-9]/.test(password)) characterSet += 10;
    if (/[^A-Za-z0-9]/.test(password)) characterSet += 33;
    
    // Calculate possible combinations
    const combinations = Math.pow(characterSet, length);
    
    // Assume 10 billion attempts per second (quantum computer capability)
    const secondsToCrack = combinations / 10000000000;
    
    if (secondsToCrack < 1) return "Instant";
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 2592000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 2592000)} months`;
    if (secondsToCrack < 315360000) return `${Math.round(secondsToCrack / 31536000)} years`;
    
    return "Centuries";
  }
}