/**
 * Authentication Middleware
 * 
 * Provides authentication and authorization middleware functions for API routes.
 * Used to protect routes that require user authentication.
 */

import { Request, Response, NextFunction } from 'express';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

// Extend the Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated(): boolean;
    }
  }
}

/**
 * Middleware to authenticate API requests
 * Checks if the user is authenticated before allowing access to protected routes
 */
export function authenticateRequest(req: Request, res: Response, next: NextFunction) {
  // For development and testing, allow authentication bypass or simulation
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // In development mode with auth bypass, set a mock user
    req.user = {
      id: 1,
      username: 'dev_user',
      role: 'admin',
      walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    };
    
    // Mock the isAuthenticated method
    req.isAuthenticated = () => true;
    
    return next();
  }
  
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    // For API routes, return 401 Unauthorized
    securityLogger.warn('Unauthenticated access attempt to protected route', SecurityEventType.AUTH_FAILURE, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown'
    });
    
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // User is authenticated, proceed
  next();
}

/**
 * Middleware to check if the user has admin role
 * Used for routes that require admin privileges
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    // First check if authenticated at all
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check if user has admin role in metadata
  if (!req.user.metadata || req.user.metadata.role !== 'admin') {
    securityLogger.warn(`User ${req.user.id} attempted to access admin route without permission`, SecurityEventType.AUTH_FAILURE, {
      userId: req.user.id,
      path: req.path,
      method: req.method
    });

    return res.status(403).json({
      success: false,
      message: 'Admin privileges required',
    });
  }

  // User is admin, proceed
  next();
}

/**
 * Middleware to check if the user has the required role
 * @param roles Array of allowed roles
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      // First check if authenticated at all
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user has the required role
    if (!req.user.metadata || !req.user.metadata.role || !roles.includes(req.user.metadata.role)) {
      securityLogger.warn(`User ${req.user.id} attempted to access route without required role`, SecurityEventType.AUTH_FAILURE, {
        userId: req.user.id,
        path: req.path,
        method: req.method,
        requiredRoles: roles,
        userRole: req.user.metadata?.role || 'none'
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient privileges',
      });
    }

    // User has the required role, proceed
    next();
  };
}