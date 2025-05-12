/**
 * WebSocket Connection Manager
 * 
 * Handles WebSocket connections with enhanced reliability, 
 * including connection tracking, client management, and broadcasting.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { v4 as uuidv4 } from 'uuid';

// Define client types with additional properties we'll track
interface ExtendedWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
  connectedAt: Date;
  subscriptions: Set<string>;
  reconnectAttempts: number;
  lastActivity: Date;
  clientAddress?: string;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ExtendedWebSocket> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pingTimeout = 30000; // 30 seconds ping timeout
  private hasCircuitBreaker = false;
  private circuitBreakThreshold = 10; // Number of errors before triggering circuit breaker
  private errorCounter = 0;
  private resetErrorCounterInterval: NodeJS.Timeout | null = null;
  private broadcastHistory: Map<string, {timestamp: Date, data: string}[]> = new Map();

  constructor(server: Server, path: string = '/ws') {
    this.wss = new WebSocketServer({ server, path });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const client = this.setupClient(ws as ExtendedWebSocket, req);
      
      // Log connection
      securityLogger.info(`WebSocket client connected: ${client.id}`, SecurityEventType.SYSTEM_ERROR, {
        clientId: client.id,
        clientAddress: client.clientAddress
      });

      // Client connected message
      this.sendToClient(client, {
        type: 'CONNECTED',
        data: {
          timestamp: new Date().toISOString(),
          clientId: client.id,
          message: 'Connected to Chronos Vault real-time server'
        }
      });

      // Setup event listeners
      this.setupMessageHandler(client);
      this.setupCloseHandler(client);
      this.setupErrorHandler(client);
    });

    // Start heartbeat interval
    this.startHeartbeat();
    
    // Start error counter reset interval
    this.resetErrorCounterInterval = setInterval(() => {
      this.errorCounter = Math.max(0, this.errorCounter - 1); // Gradually reduce errors over time
      
      // If circuit breaker is active but error count is low enough, reset it
      if (this.hasCircuitBreaker && this.errorCounter < this.circuitBreakThreshold / 2) {
        this.hasCircuitBreaker = false;
        securityLogger.info('WebSocket circuit breaker reset', SecurityEventType.SYSTEM_ERROR, {
          errorCount: this.errorCounter
        });
      }
    }, 60000); // Reset error counter every minute
  }

  private setupClient(ws: ExtendedWebSocket, req: any): ExtendedWebSocket {
    // Create extended client with additional properties
    ws.id = uuidv4();
    ws.isAlive = true;
    ws.connectedAt = new Date();
    ws.lastActivity = new Date();
    ws.subscriptions = new Set();
    ws.reconnectAttempts = 0;
    ws.clientAddress = req.socket.remoteAddress;
    
    // Add to client map
    this.clients.set(ws.id, ws);
    
    return ws;
  }

  private setupMessageHandler(client: ExtendedWebSocket) {
    client.on('message', (messageBuffer) => {
      try {
        // Update activity timestamp
        client.lastActivity = new Date();
        client.isAlive = true;
        
        const message = JSON.parse(messageBuffer.toString());
        console.log(`Received message from ${client.id}:`, message);
        
        switch (message.type) {
          case 'PING':
            this.sendToClient(client, {
              type: 'PONG',
              data: {
                timestamp: new Date().toISOString(),
                clientId: client.id
              }
            });
            break;
            
          case 'SUBSCRIBE_BRIDGE_UPDATES':
            client.subscriptions.add('bridge_updates');
            break;
            
          case 'SUBSCRIBE_TRANSACTION_UPDATES':
            client.subscriptions.add('transaction_updates');
            break;
            
          case 'UNSUBSCRIBE':
            if (message.data && message.data.topic) {
              client.subscriptions.delete(message.data.topic);
            }
            break;
            
          case 'PONG':
            // Client responded to ping
            client.isAlive = true;
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        this.errorCounter++;
        securityLogger.warn('Error processing WebSocket message', SecurityEventType.SYSTEM_ERROR, {
          error: (error as Error).message,
          clientId: client.id
        });
        
        // Check circuit breaker
        this.checkCircuitBreaker();
      }
    });
  }

  private setupCloseHandler(client: ExtendedWebSocket) {
    client.on('close', () => {
      this.clients.delete(client.id);
      securityLogger.info(`WebSocket client disconnected: ${client.id}`, SecurityEventType.SYSTEM_ERROR, {
        clientId: client.id,
        sessionDuration: new Date().getTime() - client.connectedAt.getTime()
      });
    });
  }

  private setupErrorHandler(client: ExtendedWebSocket) {
    client.on('error', (error) => {
      this.errorCounter++;
      securityLogger.error(`WebSocket error: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
        clientId: client.id,
        error: error.message
      });
      
      // Check circuit breaker
      this.checkCircuitBreaker();
    });
  }

  /**
   * Circuit breaker pattern to prevent cascading failures when too many errors occur
   */
  private checkCircuitBreaker() {
    if (this.errorCounter > this.circuitBreakThreshold && !this.hasCircuitBreaker) {
      this.hasCircuitBreaker = true;
      securityLogger.warn('WebSocket circuit breaker activated', SecurityEventType.SYSTEM_ERROR, {
        errorCount: this.errorCounter
      });
      
      // Implement circuit breaker logic - temporarily reduce functionality
      // For now we'll just log it, but in production you might want to:
      // 1. Temporarily stop accepting new connections
      // 2. Reduce broadcast frequency
      // 3. Send notifications to system admins
    }
  }

  /**
   * Start heartbeat interval to detect and remove dead connections
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          securityLogger.info(`Terminating inactive WebSocket client: ${client.id}`, SecurityEventType.SYSTEM_ERROR, {
            clientId: client.id,
            inactiveDuration: new Date().getTime() - client.lastActivity.getTime()
          });
          return client.terminate();
        }
        
        // Set isAlive to false, expecting client to respond with pong
        client.isAlive = false;
        
        // Send ping (using our own ping/pong mechanism for better tracking)
        this.sendToClient(client, { type: 'PING', data: { timestamp: new Date().toISOString() } });
      });
    }, this.pingTimeout);
  }

  /**
   * Broadcast a message to all clients with specific subscription
   */
  public broadcast(type: string, data: any, topic?: string) {
    if (this.hasCircuitBreaker && type !== 'SYSTEM_ALERT') {
      // If circuit breaker is active, only allow critical messages
      return;
    }
    
    const message = JSON.stringify({
      type,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
    
    // Save message to history for new clients to catch up
    if (topic) {
      if (!this.broadcastHistory.has(topic)) {
        this.broadcastHistory.set(topic, []);
      }
      
      const history = this.broadcastHistory.get(topic)!;
      history.push({ timestamp: new Date(), data: message });
      
      // Limit history size to 100 messages per topic
      if (history.length > 100) {
        history.shift();
      }
    }
    
    this.clients.forEach((client) => {
      // Send to all clients or only those subscribed to the topic
      if (client.readyState === WebSocket.OPEN && (!topic || client.subscriptions.has(topic))) {
        try {
          client.send(message);
        } catch (error) {
          this.errorCounter++;
          securityLogger.error('Error broadcasting message', SecurityEventType.SYSTEM_ERROR, {
            error: (error as Error).message,
            clientId: client.id
          });
        }
      }
    });
  }

  /**
   * Send a message to a specific client with retry logic
   */
  public sendToClient(client: ExtendedWebSocket, data: any, maxRetries: number = 3): boolean {
    if (client.readyState !== WebSocket.OPEN) {
      return false;
    }
    
    try {
      client.send(JSON.stringify(data));
      return true;
    } catch (error) {
      client.reconnectAttempts++;
      
      if (client.reconnectAttempts <= maxRetries) {
        // Implement exponential backoff
        const delay = Math.min(1000 * Math.pow(2, client.reconnectAttempts), 10000);
        
        setTimeout(() => {
          this.sendToClient(client, data, maxRetries);
        }, delay);
        
        return true;
      } else {
        securityLogger.error('Failed to send message to client after retries', SecurityEventType.SYSTEM_ERROR, {
          clientId: client.id,
          retries: client.reconnectAttempts,
          error: (error as Error).message
        });
        return false;
      }
    }
  }

  /**
   * Send historical messages to a client for a specific topic
   */
  public sendHistory(client: ExtendedWebSocket, topic: string) {
    if (this.broadcastHistory.has(topic)) {
      const history = this.broadcastHistory.get(topic)!;
      
      // Send history with a delay to prevent flooding
      history.forEach((item, index) => {
        setTimeout(() => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(item.data);
          }
        }, index * 50); // 50ms delay between each historical message
      });
    }
  }

  /**
   * Get the number of connected clients
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Get client connection statistics
   */
  public getStats() {
    return {
      totalClients: this.clients.size,
      circuitBreakerActive: this.hasCircuitBreaker,
      errorCount: this.errorCounter,
      subscriptionCounts: this.getSubscriptionCounts()
    };
  }

  private getSubscriptionCounts() {
    const counts: Record<string, number> = {};
    
    this.clients.forEach((client) => {
      client.subscriptions.forEach((sub) => {
        counts[sub] = (counts[sub] || 0) + 1;
      });
    });
    
    return counts;
  }

  /**
   * Clean up resources on shutdown
   */
  public shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.resetErrorCounterInterval) {
      clearInterval(this.resetErrorCounterInterval);
    }
    
    // Close all client connections
    this.clients.forEach((client) => {
      client.terminate();
    });
    
    // Close the WebSocket server
    this.wss.close();
  }
}

// Create a singleton instance
let websocketManagerInstance: WebSocketManager | null = null;

/**
 * Initialize the WebSocket manager with the HTTP server
 */
export function initializeWebSocketManager(server: Server): WebSocketManager {
  if (!websocketManagerInstance) {
    websocketManagerInstance = new WebSocketManager(server);
  }
  return websocketManagerInstance;
}

/**
 * Get the WebSocket manager instance
 */
export function getWebSocketManager(): WebSocketManager {
  if (!websocketManagerInstance) {
    throw new Error('WebSocket manager not initialized. Call initializeWebSocketManager first.');
  }
  return websocketManagerInstance;
}