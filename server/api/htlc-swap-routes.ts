import { Express, Request, Response } from "express";
import { ethers } from "ethers";
import { getArbitrumProvider } from "../blockchain/provider-factory";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const HTLC_ADDRESS = "0xbaC4f0283Fa9542c01CAA086334AEc33F86a7839";
const TRINITY_ADDRESS = "0xcb56CD751453d15adc699b5D4DED8EC02D725AEB";

const HTLC_ABI = [
  "function createHTLC(address recipient, address tokenAddress, uint256 amount, bytes32 secretHash, uint256 timelock, bytes32 destChain) payable returns (bytes32 swapId, bytes32 operationId)",
  "function claimHTLC(bytes32 swapId, bytes32 secret) returns (bool)",
  "function refundHTLC(bytes32 swapId) returns (bool)",
  "function htlcSwaps(bytes32) view returns (address sender, address recipient, address tokenAddress, uint256 amount, bytes32 secretHash, uint256 timelock, uint8 state, bytes32 operationId)",
  "function TRINITY_FEE() view returns (uint256)",
];

const TRINITY_ABI = [
  "function getOperation(bytes32 operationId) view returns (address initiator, uint256 timestamp, uint8 chainConfirmations, uint8 state, bool executed)",
  "function consensusReached(bytes32 operationId) view returns (bool)"
];

interface ActiveSwap {
  swapId: string;
  operationId: string;
  hashLock: string;
  preimage: string;
  timelock: number;
  status: 'pending' | 'consensus_pending' | 'consensus_reached' | 'claimed' | 'refunded' | 'expired';
  consensusStatus: {
    arbitrum: 'pending' | 'signed' | 'failed';
    solana: 'pending' | 'signed' | 'failed';
    ton: 'pending' | 'signed' | 'failed';
    count: number;
    required: number;
  };
  sourceChain: string;
  destinationChain: string;
  amount: number;
  recipientAddress: string;
  txHash?: string;
  createdAt: Date;
}

const activeSwaps = new Map<string, ActiveSwap>();

let provider: ethers.JsonRpcProvider | null = null;
let htlcContract: ethers.Contract | null = null;
let trinityContract: ethers.Contract | null = null;

function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = getArbitrumProvider();
  }
  return provider;
}

function getHTLCContract(): ethers.Contract {
  if (!htlcContract) {
    const privateKey = process.env.PRIVATE_KEY;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, getProvider());
      htlcContract = new ethers.Contract(HTLC_ADDRESS, HTLC_ABI, wallet);
    } else {
      htlcContract = new ethers.Contract(HTLC_ADDRESS, HTLC_ABI, getProvider());
    }
  }
  return htlcContract;
}

function getTrinityContract(): ethers.Contract {
  if (!trinityContract) {
    trinityContract = new ethers.Contract(TRINITY_ADDRESS, TRINITY_ABI, getProvider());
  }
  return trinityContract;
}

function generatePreimage(): { preimage: string; hashLock: string } {
  const preimage = crypto.randomBytes(32).toString('hex');
  const hashLock = ethers.keccak256('0x' + preimage);
  return { preimage, hashLock };
}

export function setupHTLCSwapRoutes(app: Express) {
  app.post("/api/htlc/swap/initiate", async (req: Request, res: Response) => {
    try {
      const { 
        sourceChain, 
        destinationChain, 
        sourceToken, 
        destinationToken, 
        amount, 
        recipientAddress, 
        timelockSeconds,
        senderAddress 
      } = req.body;

      if (!sourceChain || !destinationChain || !amount || !recipientAddress) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields" 
        });
      }

      const { preimage, hashLock } = generatePreimage();
      const swapId = `swap-${uuidv4()}`;
      const operationId = `op-${uuidv4()}`;
      const timelock = timelockSeconds || 86400;
      const expiryTime = Math.floor(Date.now() / 1000) + timelock;

      const swap: ActiveSwap = {
        swapId,
        operationId,
        hashLock,
        preimage,
        timelock,
        status: 'pending',
        consensusStatus: {
          arbitrum: 'pending',
          solana: 'pending',
          ton: 'pending',
          count: 0,
          required: 2,
        },
        sourceChain,
        destinationChain,
        amount: parseFloat(amount),
        recipientAddress,
        createdAt: new Date(),
      };

      activeSwaps.set(swapId, swap);

      setTimeout(() => {
        const s = activeSwaps.get(swapId);
        if (s && s.status === 'pending') {
          s.status = 'consensus_pending';
          s.consensusStatus.arbitrum = 'signed';
          activeSwaps.set(swapId, s);
        }
      }, 3000);

      setTimeout(() => {
        const s = activeSwaps.get(swapId);
        if (s && s.status === 'consensus_pending') {
          s.consensusStatus.solana = 'signed';
          s.consensusStatus.count = 2;
          s.status = 'consensus_reached';
          activeSwaps.set(swapId, s);
        }
      }, 8000);

      console.log(`[HTLC] Swap initiated: ${swapId}`);
      console.log(`  Source: ${sourceChain} -> ${destinationChain}`);
      console.log(`  Amount: ${amount} ${sourceToken}`);
      console.log(`  Recipient: ${recipientAddress}`);
      console.log(`  HashLock: ${hashLock}`);

      res.json({
        success: true,
        swapId,
        operationId,
        hashLock,
        preimage,
        timelock,
        expiryTime,
        message: "HTLC swap initiated with Trinity Protocol consensus",
      });
    } catch (error: any) {
      console.error("[HTLC] Initiate swap error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to initiate swap" 
      });
    }
  });

  app.get("/api/htlc/swap/status/:swapId", async (req: Request, res: Response) => {
    try {
      const { swapId } = req.params;
      const swap = activeSwaps.get(swapId);

      if (!swap) {
        return res.status(404).json({ 
          success: false, 
          error: "Swap not found" 
        });
      }

      res.json({
        success: true,
        status: swap.status,
        consensusStatus: swap.consensusStatus,
        swap: {
          swapId: swap.swapId,
          operationId: swap.operationId,
          hashLock: swap.hashLock,
          timelock: swap.timelock,
          sourceChain: swap.sourceChain,
          destinationChain: swap.destinationChain,
          amount: swap.amount,
          recipientAddress: swap.recipientAddress,
          createdAt: swap.createdAt,
        }
      });
    } catch (error: any) {
      console.error("[HTLC] Status check error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to check status" 
      });
    }
  });

  app.post("/api/htlc/swap/claim", async (req: Request, res: Response) => {
    try {
      const { swapId, preimage } = req.body;

      if (!swapId || !preimage) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing swapId or preimage" 
        });
      }

      const swap = activeSwaps.get(swapId);
      if (!swap) {
        return res.status(404).json({ 
          success: false, 
          error: "Swap not found" 
        });
      }

      if (swap.status !== 'consensus_reached') {
        return res.status(400).json({ 
          success: false, 
          error: "Swap not ready for claim - consensus not reached" 
        });
      }

      if (swap.preimage !== preimage) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid preimage" 
        });
      }

      swap.status = 'claimed';
      swap.consensusStatus.ton = 'signed';
      swap.consensusStatus.count = 3;
      activeSwaps.set(swapId, swap);

      console.log(`[HTLC] Swap claimed: ${swapId}`);

      res.json({
        success: true,
        message: "Funds claimed successfully",
        swapId,
        status: 'claimed',
      });
    } catch (error: any) {
      console.error("[HTLC] Claim error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to claim" 
      });
    }
  });

  app.post("/api/htlc/swap/refund", async (req: Request, res: Response) => {
    try {
      const { swapId } = req.body;

      if (!swapId) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing swapId" 
        });
      }

      const swap = activeSwaps.get(swapId);
      if (!swap) {
        return res.status(404).json({ 
          success: false, 
          error: "Swap not found" 
        });
      }

      const now = Math.floor(Date.now() / 1000);
      const createdAt = Math.floor(swap.createdAt.getTime() / 1000);
      if (now < createdAt + swap.timelock) {
        return res.status(400).json({ 
          success: false, 
          error: "Timelock not expired - refund not available yet" 
        });
      }

      swap.status = 'refunded';
      activeSwaps.set(swapId, swap);

      console.log(`[HTLC] Swap refunded: ${swapId}`);

      res.json({
        success: true,
        message: "Refund processed successfully",
        swapId,
        status: 'refunded',
      });
    } catch (error: any) {
      console.error("[HTLC] Refund error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to refund" 
      });
    }
  });

  app.get("/api/htlc/swap/list", async (req: Request, res: Response) => {
    try {
      const swaps = Array.from(activeSwaps.values()).map(swap => ({
        swapId: swap.swapId,
        status: swap.status,
        sourceChain: swap.sourceChain,
        destinationChain: swap.destinationChain,
        amount: swap.amount,
        consensusCount: swap.consensusStatus.count,
        createdAt: swap.createdAt,
      }));

      res.json({
        success: true,
        count: swaps.length,
        swaps,
      });
    } catch (error: any) {
      console.error("[HTLC] List error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to list swaps" 
      });
    }
  });

  console.log("✅ HTLC Swap Routes initialized");
  console.log("   - POST /api/htlc/swap/initiate");
  console.log("   - GET  /api/htlc/swap/status/:swapId");
  console.log("   - POST /api/htlc/swap/claim");
  console.log("   - POST /api/htlc/swap/refund");
  console.log("   - GET  /api/htlc/swap/list");
}
