import { Router, Request, Response } from 'express';
import { intentInheritanceService } from '../services/intent-inheritance-service';
import { securityLogger } from '../monitoring/security-logger';
import { CrossChainErrorCategory } from '../security/cross-chain-error-handler';
import { z } from 'zod';

// Create router
export const intentInheritanceRouter = Router();

/**
 * Validate intent inheritance request schema
 */
const inheritanceIntentSchema = z.object({
  vaultId: z.string().min(1),
  naturalLanguageIntent: z.string().min(10).max(5000),
  preferredChain: z.enum(['ETH', 'SOL', 'TON', 'BTC']).optional(),
});

/**
 * Validate code generation request schema
 */
const codeGenerationSchema = z.object({
  planId: z.string().min(1),
  chain: z.enum(['ETH', 'SOL', 'TON', 'BTC']),
});

/**
 * Handles errors with appropriate response format
 */
function handleApiError(res: Response, error: any, context: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  securityLogger.error(`Error in intent inheritance API: ${context}`, {
    errorCategory: CrossChainErrorCategory.VALIDATION_FAILURE,
    errorMessage,
    statusCode: 500,
    operation: context
  });
  
  res.status(500).json({
    success: false,
    error: `Failed to ${context}: ${errorMessage}`
  });
}

/**
 * Route: Parse natural language inheritance intent
 * 
 * This endpoint takes a natural language description of inheritance wishes
 * and converts it to a structured, AI-validated inheritance plan using Claude.
 */
intentInheritanceRouter.post('/parse', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validationResult = inheritanceIntentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.format()
      });
    }
    
    const { vaultId, naturalLanguageIntent } = validationResult.data;
    
    // Parse the intent using AI
    const plan = await intentInheritanceService.parseIntent(naturalLanguageIntent, vaultId);
    
    // Log the successful operation
    securityLogger.info('Successfully parsed inheritance intent', {
      vaultId,
      planId: plan.id,
      beneficiaryCount: plan.beneficiaries.length,
      status: plan.status
    });
    
    // Return the parsed plan
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    handleApiError(res, error, 'parse inheritance intent');
  }
});

/**
 * Route: Verify an inheritance plan for consistency and security
 */
intentInheritanceRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const plan = req.body.plan;
    
    if (!plan || !plan.id || !plan.vaultId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid inheritance plan data'
      });
    }
    
    // Verify the plan
    const verifiedPlan = await intentInheritanceService.verifyInheritancePlan(plan);
    
    // Log the successful operation
    securityLogger.info('Successfully verified inheritance plan', {
      vaultId: verifiedPlan.vaultId,
      planId: verifiedPlan.id,
      status: verifiedPlan.status,
      issueCount: verifiedPlan.securityChecks.potentialIssues.length
    });
    
    // Return the verified plan
    res.status(200).json({
      success: true,
      data: verifiedPlan
    });
  } catch (error) {
    handleApiError(res, error, 'verify inheritance plan');
  }
});

/**
 * Route: Generate smart contract code for an inheritance plan
 */
intentInheritanceRouter.post('/generate-code', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validationResult = codeGenerationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.format()
      });
    }
    
    const { planId, chain } = validationResult.data;
    const plan = req.body.plan;
    
    if (!plan || plan.id !== planId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing inheritance plan'
      });
    }
    
    // Generate smart contract code
    const code = await intentInheritanceService.generateSmartContractCode(plan, chain);
    
    // Log the successful operation
    securityLogger.info('Successfully generated smart contract code', {
      vaultId: plan.vaultId,
      planId: plan.id,
      chain,
      codeLength: code.length
    });
    
    // Return the generated code
    res.status(200).json({
      success: true,
      data: {
        code,
        chain,
        planId
      }
    });
  } catch (error) {
    handleApiError(res, error, 'generate smart contract code');
  }
});

/**
 * Route: Check if feature is available and credentials are set
 */
intentInheritanceRouter.get('/status', (_req: Request, res: Response) => {
  const isAvailable = !!process.env.ANTHROPIC_API_KEY;
  
  res.status(200).json({
    success: true,
    data: {
      available: isAvailable,
      reason: isAvailable ? null : 'Missing ANTHROPIC_API_KEY configuration'
    }
  });
});