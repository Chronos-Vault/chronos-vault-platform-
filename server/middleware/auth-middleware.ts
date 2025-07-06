/**
 * Authentication Middleware
 * 
 * This middleware provides authentication and authorization for API routes.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Authentication status enum
 */
export enum AuthenticationStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  DEVELOPMENT_BYPASS = 'development_bypass'
}

/**
 * Require authentication middleware
 * 
 * This middleware checks if the user is authenticated based on the session
 * and either allows the request to proceed or returns a 401 Unauthorized response.
 * 
 * @param requiredStatus The required authentication status
 * @returns Middleware function
 */
export function requireAuth(requiredStatus: AuthenticationStatus = AuthenticationStatus.AUTHENTICATED) {
  return (req: Request, res: Response, next: NextFunction) => {
    // In development mode, we can bypass authentication if requested
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Development mode: Bypassing authentication checks');
      req.user = {
        id: 'dev-user-id',
        username: 'dev-user',
        email: 'dev@example.com',
        createdAt: new Date(),
        role: 'admin'
      };
      
      return next();
    }
    
    // Check if the user is authenticated
    if (requiredStatus === AuthenticationStatus.AUTHENTICATED && !req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Allow the request to proceed
    next();
  };
}

/**
 * Require admin role middleware
 * 
 * This middleware checks if the authenticated user has the admin role
 * and either allows the request to proceed or returns a 403 Forbidden response.
 * 
 * @returns Middleware function
 */
export function requireAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    // In development mode, we can bypass role checks
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Development mode: Bypassing admin role check');
      return next();
    }
    
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Check if the user has the admin role
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Administrator access required'
      });
    }
    
    // Allow the request to proceed
    next();
  };
}

/**
 * Optional authentication middleware
 * 
 * This middleware attaches the user to the request if authenticated
 * but does not require authentication to proceed.
 * 
 * @returns Middleware function
 */
export function optionalAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    // In development mode, we can provide a default user
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Development mode: Setting default user for optional auth');
      req.user = {
        id: 'dev-user-id',
        username: 'dev-user',
        email: 'dev@example.com',
        createdAt: new Date(),
        role: 'user'
      };
    }
    
    // Allow the request to proceed regardless of authentication status
    next();
  };
}