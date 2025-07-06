/**
 * Payment API Routes
 * 
 * This module provides payment-related API endpoints for the Chronos Vault platform.
 */

import { Router, Request, Response } from 'express';
import { stripeService } from '../payments/stripe-service';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

const router = Router();

/**
 * Create a payment intent
 * 
 * Creates a payment intent for processing payments through Stripe
 */
router.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', description, vaultId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid amount is required'
      });
    }
    
    // Create metadata object with additional information if provided
    const metadata: Record<string, string> = {};
    if (vaultId) {
      metadata.vaultId = String(vaultId);
    }
    
    // Create payment intent using the Stripe service
    const paymentIntent = await stripeService.createPaymentIntent({
      amount,
      currency,
      description,
      metadata
    });
    
    // Return only the client secret (not the full payment intent)
    // This is safe to expose to the client
    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    securityLogger.error('Failed to create payment intent', SecurityEventType.SYSTEM_ERROR, { errorDetails: String(error) });
    
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Webhook handler for Stripe events
 * 
 * Processes webhook events from Stripe
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({
      status: 'error',
      message: 'Stripe signature missing'
    });
  }
  
  try {
    // In a real implementation, you would verify the webhook signature
    // with Stripe.constructEvent() using a webhook secret
    
    // Process the webhook event
    const result = await stripeService.handleWebhookEvent(req.body);
    
    res.status(200).json({
      status: result.success ? 'success' : 'error',
      message: result.message
    });
  } catch (error) {
    securityLogger.error('Failed to process Stripe webhook', SecurityEventType.SYSTEM_ERROR, { errorDetails: String(error) });
    
    res.status(400).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

export default router;