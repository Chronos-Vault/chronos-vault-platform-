import Anthropic from '@anthropic-ai/sdk';
import { securityLogger } from '../monitoring/security-logger';
import { CrossChainErrorCategory } from '../security/cross-chain-error-handler';
import { BlockchainType } from '../../shared/types';
import { edgeCaseHandler } from '../blockchain/edge-case-handler';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

// Interface for parsed intent conditions
interface IntentCondition {
  type: 'time' | 'event' | 'market' | 'multi-sig' | 'geolocation' | 'data-feed' | 'custom';
  description: string;
  parameters: Record<string, any>;
  chainImplementation: Partial<Record<BlockchainType, string>>;
  fallbackDescription: string;
}

// Interface for AI-validated inheritance plan
interface InheritancePlan {
  id: string;
  naturalLanguageIntent: string;
  vaultId: string;
  beneficiaries: Array<{
    address: string;
    chain: BlockchainType;
    share: number;
    conditions: IntentCondition[];
  }>;
  securityChecks: {
    intentClassification: string;
    potentialIssues: string[];
    contradictions: string[];
    ambiguities: string[];
    recommendation: string;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'verified' | 'active' | 'disputed' | 'executed';
}

/**
 * Intent-Based Inheritance Service
 * 
 * This service translates natural language inheritance intentions into
 * executable blockchain logic through AI interpretation.
 */
export class IntentInheritanceService {
  private readonly systemPrompt = `
    You are a legally-trained AI assistant specializing in digital asset inheritance planning.
    Your task is to interpret a user's natural language instructions for how their digital assets
    should be handled or inherited, and translate these instructions into a structured format.
    
    Follow these guidelines:
    1. Carefully parse the natural language intent for conditions (time-based, event-based, market-based, etc.)
    2. Identify all intended beneficiaries and their allocated shares
    3. Detect any contradictions, ambiguities, or legal issues in the instructions
    4. Provide a structured representation of the inheritance plan that can be implemented on multiple blockchains
    5. Flag any security concerns or potential abuse vectors
    
    The output should be valid JSON following this structure:
    {
      "beneficiaries": [
        {
          "description": "Detailed description of the beneficiary",
          "identifier": "Wallet address or other identifier if specified",
          "share": "Percentage or portion of assets allocated",
          "conditions": [
            {
              "type": "The type of condition (time, event, market, multi-sig, etc.)",
              "description": "A clear description of the condition",
              "parameters": { // Specific parameters for this condition type
                // For time: "unlockDate", "timespan", etc.
                // For event: "eventType", "eventSource", etc.
                // For market: "targetPrice", "marketCondition", etc.
              }
            }
          ]
        }
      ],
      "securityAssessment": {
        "potentialIssues": ["List of potential issues or vulnerabilities"],
        "contradictions": ["Any contradictory instructions"],
        "ambiguities": ["Unclear or ambiguous instructions"],
        "recommendation": "Overall recommendation for implementation"
      }
    }
  `;

  private serviceAvailable: boolean = false;
  private anthropicClient!: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      securityLogger.warn('Missing ANTHROPIC_API_KEY environment variable for Intent-Based Inheritance feature. Service will be disabled.');
      this.serviceAvailable = false;
      return;
    }

    try {
      this.anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      this.serviceAvailable = true;
      securityLogger.info('Intent Inheritance Service initialized successfully with Anthropic API');
    } catch (error) {
      securityLogger.error('Failed to initialize Anthropic client', {
        error: error instanceof Error ? error.message : String(error),
        category: CrossChainErrorCategory.VALIDATION_FAILURE
      });
      this.serviceAvailable = false;
    }
  }
  
  /**
   * Check if the intent inheritance service is available
   */
  public isServiceAvailable(): boolean {
    return this.serviceAvailable;
  }

  /**
   * Parse natural language intent into structured inheritance plan
   */
  public async parseIntent(
    naturalLanguageIntent: string,
    vaultId: string
  ): Promise<InheritancePlan> {
    if (!this.serviceAvailable) {
      throw new Error('Intent Inheritance Service is not available. Please check ANTHROPIC_API_KEY configuration.');
    }
    
    try {
      const message = await this.anthropicClient.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        system: this.systemPrompt,
        messages: [{ role: 'user', content: naturalLanguageIntent }],
      });

      // Extract the JSON from the response
      if (!message.content[0] || typeof message.content[0].text !== 'string') {
        throw new Error('Invalid response format from AI service');
      }
      
      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      // Parse the JSON
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Transform to InheritancePlan structure
      const plan: InheritancePlan = {
        id: `intent_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        naturalLanguageIntent,
        vaultId,
        beneficiaries: parsedResponse.beneficiaries.map((b: any) => ({
          address: b.identifier || 'pending_address_assignment',
          chain: 'ETH', // Default to Ethereum, can be changed later
          share: typeof b.share === 'string' ? parseFloat(b.share) : b.share,
          conditions: b.conditions.map((c: any) => this.mapConditionToChainImplementation(c))
        })),
        securityChecks: {
          intentClassification: 'inheritance', // Default classification
          potentialIssues: parsedResponse.securityAssessment.potentialIssues || [],
          contradictions: parsedResponse.securityAssessment.contradictions || [],
          ambiguities: parsedResponse.securityAssessment.ambiguities || [],
          recommendation: parsedResponse.securityAssessment.recommendation || ''
        },
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft'
      };
      
      // Validate the distributions
      this.validateDistribution(plan);
      
      return plan;
    } catch (error) {
      securityLogger.error('Failed to parse inheritance intent', {
        errorMessage: error instanceof Error ? error.message : String(error),
        category: CrossChainErrorCategory.VALIDATION_FAILURE
      });
      
      // Use edge case handler to determine if we should retry
      const { shouldRetry, delayMs } = await edgeCaseHandler.handleConnectionError(
        error,
        'ETH', // Default chain for error handling
        'anthropic-api',
        { operation: 'intent-parsing' }
      );
      
      if (shouldRetry) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.parseIntent(naturalLanguageIntent, vaultId);
      }
      
      throw error;
    }
  }

  /**
   * Verify an existing inheritance plan with AI to check for issues
   */
  public async verifyInheritancePlan(plan: InheritancePlan): Promise<InheritancePlan> {
    if (!this.serviceAvailable) {
      throw new Error('Intent Inheritance Service is not available. Please check ANTHROPIC_API_KEY configuration.');
    }
    
    try {
      const verificationPrompt = `
        Analyze the following inheritance plan for digital assets and verify its logical consistency, security implications, and potential implementation issues:
        
        ${JSON.stringify(plan, null, 2)}
        
        Please provide:
        1. Any logical contradictions between conditions
        2. Security vulnerabilities or abuse vectors
        3. Implementation challenges on different blockchains
        4. Recommendations for improvement
        
        Format your response as JSON:
        {
          "verification": {
            "isValid": boolean,
            "potentialIssues": string[],
            "contradictions": string[],
            "ambiguities": string[],
            "recommendation": string
          }
        }
      `;
      
      const message = await this.anthropicClient.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: verificationPrompt }],
      });
      
      // Extract the JSON from the response
      if (!message.content[0] || typeof message.content[0].text !== 'string') {
        throw new Error('Invalid response format from AI service');
      }
      
      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI verification response');
      }
      
      // Parse the JSON
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Update the plan with verification results
      const updatedPlan: InheritancePlan = {
        ...plan,
        securityChecks: {
          ...plan.securityChecks,
          potentialIssues: parsedResponse.verification.potentialIssues,
          contradictions: parsedResponse.verification.contradictions,
          ambiguities: parsedResponse.verification.ambiguities,
          recommendation: parsedResponse.verification.recommendation
        },
        status: parsedResponse.verification.isValid ? 'verified' : 'draft',
        updatedAt: new Date(),
        version: plan.version + 1
      };
      
      return updatedPlan;
    } catch (error) {
      securityLogger.error('Failed to verify inheritance plan', {
        errorMessage: error instanceof Error ? error.message : String(error),
        category: CrossChainErrorCategory.VALIDATION_FAILURE,
        planId: plan.id
      });
      
      throw error;
    }
  }

  /**
   * Generate smart contract code for the inheritance plan
   * tailored to specific blockchain platforms
   */
  public async generateSmartContractCode(
    plan: InheritancePlan,
    chain: BlockchainType
  ): Promise<string> {
    if (!this.serviceAvailable) {
      throw new Error('Intent Inheritance Service is not available. Please check ANTHROPIC_API_KEY configuration.');
    }
    
    try {
      let languagePrompt: string;
      let contractTemplate: string;
      
      // Determine the appropriate language and template based on chain
      switch (chain) {
        case 'ETH':
          languagePrompt = 'Solidity smart contract';
          contractTemplate = `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.17;
            
            contract IntentBasedInheritance {
              // Contract code will be generated here
            }
          `;
          break;
        case 'SOL':
          languagePrompt = 'Rust program for Solana';
          contractTemplate = `
            use solana_program::{
                account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
            };
            
            entrypoint!(process_instruction);
            
            pub fn process_instruction(
                program_id: &Pubkey,
                accounts: &[AccountInfo],
                instruction_data: &[u8],
            ) -> ProgramResult {
                // Program code will be generated here
                Ok(())
            }
          `;
          break;
        case 'TON':
          languagePrompt = 'FunC smart contract for TON';
          contractTemplate = `
            #include "imports/stdlib.fc";
            
            () recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
              // Contract code will be generated here
            }
          `;
          break;
        case 'BTC':
          languagePrompt = 'Bitcoin Script';
          contractTemplate = `
            // Bitcoin script for inheritance logic
            // Uses OP_CHECKTIMELOCKVERIFY and other operations
          `;
          break;
        default:
          throw new Error(`Unsupported blockchain for smart contract generation: ${chain}`);
      }
      
      const generationPrompt = `
        Generate a ${languagePrompt} for an intent-based inheritance plan with the following specifications:
        
        ${JSON.stringify(plan, null, 2)}
        
        Start with this template:
        ${contractTemplate}
        
        Implement all the conditions, including:
        1. Time-based locks
        2. Multi-signature requirements
        3. External data verification
        4. Beneficiary distribution logic
        
        Focus on security, gas optimization, and resilience to edge cases.
        Provide comments explaining the complex logic.
      `;
      
      const message = await this.anthropicClient.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4000, // More tokens for code generation
        messages: [{ role: 'user', content: generationPrompt }],
      });
      
      // Extract the code from the response
      if (!message.content[0] || typeof message.content[0].text !== 'string') {
        throw new Error('Invalid response format from AI service');
      }
      
      const responseText = message.content[0].text;
      const codeBlockMatch = responseText.match(/```(?:[a-z]*\n)?([\s\S]*?)```/);
      
      if (!codeBlockMatch) {
        return responseText; // Return the full text if no code block is found
      }
      
      return codeBlockMatch[1].trim();
    } catch (error) {
      securityLogger.error('Failed to generate smart contract code', {
        errorMessage: error instanceof Error ? error.message : String(error),
        category: CrossChainErrorCategory.VALIDATION_FAILURE,
        planId: plan.id,
        chain
      });
      
      throw error;
    }
  }

  /**
   * Convert natural language condition to blockchain-specific implementation
   */
  private mapConditionToChainImplementation(condition: any): IntentCondition {
    // The implementation mapping would vary by condition type and chain
    const mappedCondition: IntentCondition = {
      type: condition.type,
      description: condition.description,
      parameters: condition.parameters || {},
      chainImplementation: {},
      fallbackDescription: condition.description
    };
    
    // Add chain-specific implementation details based on condition type
    if (condition.type === 'time') {
      mappedCondition.chainImplementation = {
        ETH: 'Solidity: require(block.timestamp > unlockTime)',
        SOL: 'Solana: Clock::get()?.unix_timestamp > unlock_time',
        TON: 'TON: now() > unlock_time',
        BTC: 'Bitcoin: OP_CHECKLOCKTIMEVERIFY OP_DROP'
      };
    } else if (condition.type === 'multi-sig') {
      mappedCondition.chainImplementation = {
        ETH: 'Solidity: MultiSig pattern with ecrecover',
        SOL: 'Solana: Multisignature with verify_signatures function',
        TON: 'TON: check_signatures() function',
        BTC: 'Bitcoin: OP_CHECKMULTISIG with M-of-N pattern'
      };
    } else if (condition.type === 'market') {
      mappedCondition.chainImplementation = {
        ETH: 'Solidity: Chainlink Price Feed Oracle',
        SOL: 'Solana: Pyth Network price oracle',
        TON: 'TON: Oracle integration via jettons',
        BTC: 'Bitcoin: Limited support, may require external oracles'
      };
    } else if (condition.type === 'geolocation') {
      mappedCondition.chainImplementation = {
        ETH: 'Solidity: External oracle verification',
        SOL: 'Solana: GeolocationVerifier program',
        TON: 'TON: External verification with provider signature',
        BTC: 'Bitcoin: Limited support, requires trusted third party'
      };
    }
    
    return mappedCondition;
  }

  /**
   * Validate that beneficiary distributions add up to 100%
   */
  private validateDistribution(plan: InheritancePlan): void {
    const totalShare = plan.beneficiaries.reduce((sum, beneficiary) => sum + beneficiary.share, 0);
    
    // Allow for minor rounding errors
    if (totalShare < 99.9 || totalShare > 100.1) {
      securityLogger.warn('Inheritance plan distributions do not sum to 100%', {
        planId: plan.id,
        totalShare,
        beneficiaries: plan.beneficiaries.map(b => ({ address: b.address, share: b.share }))
      });
      
      // Normalize shares to exactly 100%
      const normalizationFactor = 100 / totalShare;
      plan.beneficiaries.forEach(beneficiary => {
        beneficiary.share = parseFloat((beneficiary.share * normalizationFactor).toFixed(2));
      });
    }
  }
}

export const intentInheritanceService = new IntentInheritanceService();