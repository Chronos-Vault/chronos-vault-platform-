/**
 * WebSocket Service
 * 
 * Provides a reliable WebSocket connection with automatic reconnection,
 * exponential backoff, and subscription management.
 */

import { toast } from '@/hooks/use-toast';

export type WebSocketMessage = {
  type: string;
  data: any;
};

export type WebSocketSubscriber = {
  id: string;
  messageTypes: string[];
  callback: (message: WebSocketMessage) => void;
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private baseReconnectDelay: number = 1000; // 1 second
  private maxReconnectDelay: number = 30000; // 30 seconds
  private subscribers: WebSocketSubscriber[] = [];
  private messageQueue: WebSocketMessage[] = [];
  private pingInterval: number | null = null;
  private reconnectTimeout: number | null = null;
  private manualClose: boolean = false;

  constructor() {
    // Get the correct protocol based on whether we're using HTTPS or not
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.url = `${protocol}//${window.location.host}/ws`;
  }

  /**
   * Connect to the WebSocket server with automatic reconnection
   */
  public connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;
    this.manualClose = false;

    return new Promise((resolve, reject) => {
      try {
        console.log(`Connecting to WebSocket server at ${this.url}`);
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Send any queued messages
          this.flushMessageQueue();
          
          // Start ping interval to keep connection alive
          this.startPingInterval();
          
          resolve();
        });

        this.socket.addEventListener('message', (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        this.socket.addEventListener('close', (event) => {
          this.isConnected = false;
          this.isConnecting = false;
          
          // Clear ping interval
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
          }

          if (!this.manualClose) {
            console.log(`WebSocket connection closed (code: ${event.code}). Attempting to reconnect...`);
            this.scheduleReconnect();
          } else {
            console.log('WebSocket connection closed manually');
          }
        });

        this.socket.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          
          if (!this.isConnected) {
            // Only reject if we never connected (initial connection failure)
            reject(error);
          }
        });
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      
      toast({
        title: 'Connection Lost',
        description: 'Failed to reconnect to the server. Please refresh the page.',
        variant: 'destructive',
      });
      
      return;
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts + 1} in ${delay}ms`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(() => {
        // If connection fails, scheduleReconnect will be called by the close handler
      });
    }, delay);
  }

  /**
   * Start ping interval to keep the connection alive
   */
  private startPingInterval(): void {
    // Clear existing interval if any
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Send a ping every 30 seconds
    this.pingInterval = window.setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'PING',
          data: {
            timestamp: new Date().toISOString()
          }
        });
      }
    }, 30000);
  }

  /**
   * Send messages that were queued while disconnected
   */
  private flushMessageQueue(): void {
    if (this.messageQueue.length > 0) {
      console.log(`Sending ${this.messageQueue.length} queued messages`);
      
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.send(message);
        }
      }
    }
  }

  /**
   * Send a message to the WebSocket server
   */
  public send(message: WebSocketMessage): boolean {
    if (!this.isConnected || !this.socket) {
      console.log('Not connected. Queuing message:', message);
      this.messageQueue.push(message);
      
      // Try to establish connection if not already connecting
      if (!this.isConnecting) {
        this.connect().catch(error => {
          console.error('Failed to connect while trying to send message:', error);
        });
      }
      
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.messageQueue.push(message);
      return false;
    }
  }

  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    this.manualClose = true;
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket && (this.isConnected || this.isConnecting)) {
      this.socket.close();
      this.isConnected = false;
      this.isConnecting = false;
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    // Handle special message types
    switch (message.type) {
      case 'PONG':
        // Heartbeat response, no need to do anything
        return;
        
      case 'CONNECTED':
        // Subscribe to topics of interest
        this.sendSubscriptions();
        break;
    }

    // Dispatch message to subscribers
    this.subscribers.forEach(subscriber => {
      if (subscriber.messageTypes.includes(message.type) || subscriber.messageTypes.includes('*')) {
        subscriber.callback(message);
      }
    });
  }

  /**
   * Send subscription requests to the server
   */
  private sendSubscriptions(): void {
    // Get unique message types that need subscriptions
    const subscriptionTypes = new Set<string>();
    
    this.subscribers.forEach(subscriber => {
      subscriber.messageTypes.forEach(type => {
        if (type === 'BRIDGE_STATUS_UPDATE') {
          subscriptionTypes.add('SUBSCRIBE_BRIDGE_UPDATES');
        } else if (
          type === 'VERIFICATION_COMPLETED' || 
          type === 'TRANSACTION_CONFIRMED' || 
          type === 'TRANSACTION_FAILED'
        ) {
          subscriptionTypes.add('SUBSCRIBE_TRANSACTION_UPDATES');
        } else if (
          type === 'SECURITY_STATUS_UPDATE'
        ) {
          subscriptionTypes.add('SUBSCRIBE_SECURITY_UPDATES');
        }
      });
    });
    
    // Send subscription requests
    subscriptionTypes.forEach(type => {
      this.send({ type, data: {} });
    });
  }

  /**
   * Subscribe to specific message types
   */
  public subscribe(id: string, messageTypes: string[], callback: (message: WebSocketMessage) => void): void {
    // Remove existing subscription with this ID if it exists
    this.unsubscribe(id);
    
    // Add new subscription
    this.subscribers.push({
      id,
      messageTypes,
      callback
    });
    
    // If we're already connected, send subscription requests
    if (this.isConnected) {
      this.sendSubscriptions();
    } else if (!this.isConnecting) {
      // Try to connect if not already
      this.connect().catch(error => {
        console.error('Failed to connect while trying to subscribe:', error);
      });
    }
  }

  /**
   * Unsubscribe from WebSocket messages
   */
  public unsubscribe(id: string): void {
    const index = this.subscribers.findIndex(sub => sub.id === id);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService();