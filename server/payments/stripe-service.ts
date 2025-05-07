/**
 * Stripe Payment Service
 * 
 * This module provides integration with Stripe for payment processing,
 * including subscriptions, one-time payments, and webhook handling for
 * the Chronos Vault platform.
 */

import Stripe from 'stripe';
import { securityLogger } from '../monitoring/security-logger';
import config from '../config';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

// Define subscription tiers
export enum SubscriptionTier {
  VAULT_GUARDIAN = 'vault_guardian',  // 1,000+ CVT staked - 75% fee reduction
  VAULT_ARCHITECT = 'vault_architect', // 10,000+ CVT staked - 90% fee reduction
  VAULT_SOVEREIGN = 'vault_sovereign', // 100,000+ CVT staked - 100% fee reduction
}

// Define subscription product types
export enum ProductType {
  VAULT_BASIC = 'vault_basic',   // Basic vault security
  VAULT_ADVANCED = 'vault_advanced', // Advanced vault security (cross-chain)
  VAULT_ENTERPRISE = 'vault_enterprise', // Enterprise vault security (full suite)
}

export interface PaymentIntentOptions {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface SubscriptionOptions {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialDays?: number;
}

class StripeService {
  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    try {
      return await stripe.customers.create({
        email,
        name,
        metadata
      });
    } catch (error) {
      securityLogger.error('Failed to create Stripe customer', error);
      throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a payment intent for one-time payment
   */
  async createPaymentIntent(options: PaymentIntentOptions): Promise<Stripe.PaymentIntent> {
    try {
      const { amount, currency = 'usd', metadata = {}, description } = options;
      
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      securityLogger.error('Failed to create payment intent', error);
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(options: SubscriptionOptions): Promise<Stripe.Subscription> {
    try {
      const { customerId, priceId, metadata = {}, trialDays } = options;

      const subscriptionParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata
      };

      if (trialDays) {
        subscriptionParams.trial_period_days = trialDays;
      }

      return await stripe.subscriptions.create(subscriptionParams);
    } catch (error) {
      securityLogger.error('Failed to create subscription', error);
      throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      securityLogger.error('Failed to cancel subscription', error);
      throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      securityLogger.error('Failed to retrieve subscription', error);
      throw new Error(`Failed to retrieve subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    try {
      securityLogger.info('Processing Stripe webhook event', { type: event.type });

      switch (event.type) {
        case 'invoice.payment_succeeded':
          return await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          
        case 'invoice.payment_failed':
          return await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          
        case 'customer.subscription.created':
          return await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          
        case 'customer.subscription.updated':
          return await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          
        case 'customer.subscription.deleted':
          return await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          
        default:
          return { success: true, message: `Unhandled event type: ${event.type}` };
      }
    } catch (error) {
      securityLogger.error('Failed to process webhook event', error);
      return { 
        success: false, 
        message: `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Handle invoice payment succeeded event
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would update the user's subscription status
    securityLogger.info('Invoice payment succeeded', { 
      invoiceId: invoice.id, 
      customerId: invoice.customer, 
      amount: invoice.amount_paid 
    });
    
    return { success: true, message: 'Invoice payment processed successfully' };
  }

  /**
   * Handle invoice payment failed event
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would update the user's subscription status
    securityLogger.warn('Invoice payment failed', { 
      invoiceId: invoice.id, 
      customerId: invoice.customer, 
      amount: invoice.amount_due 
    });
    
    return { success: true, message: 'Invoice payment failure processed' };
  }

  /**
   * Handle subscription created event
   */
  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would update the user's subscription status
    securityLogger.info('Subscription created', { 
      subscriptionId: subscription.id, 
      customerId: subscription.customer, 
      status: subscription.status 
    });
    
    return { success: true, message: 'Subscription creation processed' };
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would update the user's subscription status
    securityLogger.info('Subscription updated', { 
      subscriptionId: subscription.id, 
      customerId: subscription.customer, 
      status: subscription.status 
    });
    
    return { success: true, message: 'Subscription update processed' };
  }

  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would update the user's subscription status
    securityLogger.info('Subscription deleted', { 
      subscriptionId: subscription.id, 
      customerId: subscription.customer, 
      status: subscription.status 
    });
    
    return { success: true, message: 'Subscription deletion processed' };
  }

  /**
   * Calculate discount based on CVT token staking amount
   */
  calculateFeeDiscount(stakingAmount: number): number {
    if (stakingAmount >= 100000) {
      // Vault Sovereign - 100% fee reduction
      return 1.0;
    } else if (stakingAmount >= 10000) {
      // Vault Architect - 90% fee reduction
      return 0.9;
    } else if (stakingAmount >= 1000) {
      // Vault Guardian - 75% fee reduction
      return 0.75;
    } else {
      // No discount
      return 0;
    }
  }
}

export const stripeService = new StripeService();