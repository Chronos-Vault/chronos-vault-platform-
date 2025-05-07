/**
 * Server Configuration
 */

const config = {
  isDevelopmentMode: process.env.NODE_ENV === 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  security: {
    maxRetryAttempts: 5,
    lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
    jwtSecret: process.env.JWT_SECRET || 'chronos-vault-dev-secret',
    jwtExpiryTime: '24h'
  }
};

export default config;