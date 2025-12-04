import { Express, Request, Response } from "express";
import { ethers } from "ethers";
import { getArbitrumProvider } from "./blockchain/provider-factory";

// Contract ABIs
const HTLC_ABI = [
  "function createHTLC(address recipient, address tokenAddress, uint256 amount, bytes32 secretHash, uint256 timelock, bytes32 destChain) payable returns (bytes32 swapId, bytes32 operationId)",
  "function claimHTLC(bytes32 swapId, bytes32 secret) returns (bool)",
  "function refundHTLC(bytes32 swapId) returns (bool)",
  "function htlcSwaps(bytes32) view returns (address sender, address recipient, address tokenAddress, uint256 amount, bytes32 secretHash, uint256 timelock, uint8 state, bytes32 operationId)",
  "function TRINITY_FEE() view returns (uint256)",
  "event HTLCCreated(bytes32 indexed swapId, bytes32 indexed operationId, address indexed sender, address recipient, uint256 amount, bytes32 secretHash, uint256 timelock, bytes32 destChain)",
  "event HTLCClaimed(bytes32 indexed swapId, bytes32 indexed operationId, address indexed recipient, uint256 amount, bytes32 secret)",
  "event HTLCRefunded(bytes32 indexed swapId, bytes32 indexed operationId, address indexed sender, uint256 amount)"
];

const TRINITY_ABI = [
  "function submitValidation(bytes32 operationId, bytes32 proof, uint256 nonce) returns (bool)",
  "function getOperation(bytes32 operationId) view returns (address initiator, uint256 timestamp, uint8 chainConfirmations, uint8 state, bool executed)",
  "function consensusReached(bytes32 operationId) view returns (bool)"
];

// Contract addresses from deployment
const HTLC_ADDRESS = "0xbaC4f0283Fa9542c01CAA086334AEc33F86a7839";
const TRINITY_ADDRESS = "0xcb56CD751453d15adc699b5D4DED8EC02D725AEB";

// LAZY INITIALIZATION: Provider and contracts created on first use to avoid startup crashes
let provider: ethers.JsonRpcProvider | null = null;
let deployer: ethers.Wallet | null = null;
let htlcContract: ethers.Contract | null = null;
let trinityContract: ethers.Contract | null = null;

function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = getArbitrumProvider();
  }
  return provider;
}

function getDeployer(): ethers.Wallet {
  if (!deployer) {
    deployer = new ethers.Wallet(process.env.PRIVATE_KEY || "", getProvider());
  }
  return deployer;
}

function getHTLCContract(): ethers.Contract {
  if (!htlcContract) {
    htlcContract = new ethers.Contract(HTLC_ADDRESS, HTLC_ABI, getDeployer());
  }
  return htlcContract;
}

function getTrinityContract(): ethers.Contract {
  if (!trinityContract) {
    trinityContract = new ethers.Contract(TRINITY_ADDRESS, TRINITY_ABI, getDeployer());
  }
  return trinityContract;
}

export function setupHTLCTestRoutes(app: Express) {
  // Health check
  app.get("/api/htlc-test/health", async (req: Request, res: Response) => {
    try {
      const network = await getProvider().getNetwork();
      const balance = await getProvider().getBalance(getDeployer().address);
      const trinityFee = await getHTLCContract().TRINITY_FEE();

      res.json({
        status: "healthy",
        network: {
          name: network.name,
          chainId: Number(network.chainId),
        },
        deployer: getDeployer().address,
        balance: ethers.formatEther(balance),
        contracts: {
          htlc: HTLC_ADDRESS,
          trinity: TRINITY_ADDRESS,
        },
        trinityFee: ethers.formatEther(trinityFee),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTLC swap
  app.post("/api/htlc-test/create-swap", async (req: Request, res: Response) => {
    try {
      const { recipient, amount, secret, timelockDays } = req.body;

      // Validate inputs
      if (!recipient || !amount || !secret) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate secret hash
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
      
      // Calculate timelock (current time + days)
      const timelock = Math.floor(Date.now() / 1000) + (timelockDays || 7) * 86400;

      // Destination chain as bytes32
      const destChain = ethers.encodeBytes32String("SOLANA");

      // Get Trinity fee
      const trinityFee = await getHTLCContract().TRINITY_FEE();

      console.log("\n🔱 Creating HTLC Swap:");
      console.log("  Recipient:", recipient);
      console.log("  Amount:", ethers.formatEther(amount), "ETH");
      console.log("  Secret Hash:", secretHash);
      console.log("  Timelock:", new Date(timelock * 1000).toISOString());
      console.log("  Dest Chain:", destChain);
      console.log("  Trinity Fee:", ethers.formatEther(trinityFee), "ETH");

      // Create swap (ETH swap: tokenAddress = 0x0, msg.value = amount + fee)
      const tx = await getHTLCContract().createHTLC(
        recipient,
        ethers.ZeroAddress, // ETH swap
        ethers.parseEther(amount),
        secretHash,
        timelock,
        destChain,
        {
          value: ethers.parseEther(amount) + trinityFee,
        }
      );

      console.log("  Transaction hash:", tx.hash);
      console.log("  Waiting for confirmation...");

      const receipt = await tx.wait();
      
      // Parse event to get swapId and operationId
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = getHTLCContract().interface.parseLog(log);
          return parsed?.name === "HTLCCreated";
        } catch {
          return false;
        }
      });

      if (!event) {
        throw new Error("HTLCCreated event not found");
      }

      const parsedEvent = getHTLCContract().interface.parseLog(event);
      const swapId = parsedEvent?.args.swapId;
      const operationId = parsedEvent?.args.operationId;

      console.log("✅ Swap created!");
      console.log("  Swap ID:", swapId);
      console.log("  Operation ID:", operationId);

      res.json({
        success: true,
        transactionHash: tx.hash,
        swapId,
        operationId,
        secretHash,
        timelock,
        explorerUrl: `https://sepolia.arbiscan.io/tx/${tx.hash}`,
      });
    } catch (error: any) {
      console.error("❌ Error creating swap:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get swap details
  app.get("/api/htlc-test/swap/:swapId", async (req: Request, res: Response) => {
    try {
      const { swapId } = req.params;

      const swap = await getHTLCContract().htlcSwaps(swapId);
      const operation = await getTrinityContract().getOperation(swap.operationId);

      res.json({
        swap: {
          sender: swap.sender,
          recipient: swap.recipient,
          tokenAddress: swap.tokenAddress,
          amount: ethers.formatEther(swap.amount),
          secretHash: swap.secretHash,
          timelock: Number(swap.timelock),
          state: Number(swap.state), // 0=None, 1=Locked, 2=Claimed, 3=Refunded
          operationId: swap.operationId,
        },
        trinity: {
          initiator: operation.initiator,
          timestamp: Number(operation.timestamp),
          chainConfirmations: Number(operation.chainConfirmations),
          state: Number(operation.state),
          executed: operation.executed,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Submit Trinity validation (simulate 2-of-3 consensus)
  app.post("/api/htlc-test/submit-validation", async (req: Request, res: Response) => {
    try {
      const { operationId } = req.body;

      if (!operationId) {
        return res.status(400).json({ error: "Missing operationId" });
      }

      // Generate mock proof (in production, validators would generate real proofs)
      const proof = ethers.keccak256(ethers.toUtf8Bytes(`validation-${operationId}-${Date.now()}`));
      const nonce = Math.floor(Math.random() * 1000000);

      console.log("\n🔺 Submitting Trinity validation:");
      console.log("  Operation ID:", operationId);
      console.log("  Proof:", proof);
      console.log("  Nonce:", nonce);

      const tx = await getTrinityContract().submitValidation(operationId, proof, nonce);
      await tx.wait();

      console.log("✅ Validation submitted!");

      // Check if consensus reached
      const consensusReached = await getTrinityContract().consensusReached(operationId);

      res.json({
        success: true,
        transactionHash: tx.hash,
        consensusReached,
        explorerUrl: `https://sepolia.arbiscan.io/tx/${tx.hash}`,
      });
    } catch (error: any) {
      console.error("❌ Error submitting validation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Claim HTLC
  app.post("/api/htlc-test/claim", async (req: Request, res: Response) => {
    try {
      const { swapId, secret } = req.body;

      if (!swapId || !secret) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const secretBytes = ethers.toUtf8Bytes(secret);

      console.log("\n💰 Claiming HTLC:");
      console.log("  Swap ID:", swapId);
      console.log("  Secret:", secret);

      const tx = await getHTLCContract().claimHTLC(swapId, secretBytes);
      await tx.wait();

      console.log("✅ Swap claimed!");

      res.json({
        success: true,
        transactionHash: tx.hash,
        explorerUrl: `https://sepolia.arbiscan.io/tx/${tx.hash}`,
      });
    } catch (error: any) {
      console.error("❌ Error claiming swap:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Refund HTLC
  app.post("/api/htlc-test/refund", async (req: Request, res: Response) => {
    try {
      const { swapId } = req.body;

      if (!swapId) {
        return res.status(400).json({ error: "Missing swapId" });
      }

      console.log("\n🔙 Refunding HTLC:");
      console.log("  Swap ID:", swapId);

      const tx = await getHTLCContract().refundHTLC(swapId);
      await tx.wait();

      console.log("✅ Swap refunded!");

      res.json({
        success: true,
        transactionHash: tx.hash,
        explorerUrl: `https://sepolia.arbiscan.io/tx/${tx.hash}`,
      });
    } catch (error: any) {
      console.error("❌ Error refunding swap:", error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log("✅ HTLC Test Routes initialized");
  console.log("   HTLC Contract:", HTLC_ADDRESS);
  console.log("   Trinity Contract:", TRINITY_ADDRESS);
  console.log("   Network: Arbitrum Sepolia");
}
