/**
 * TON Connect Session Storage
 * 
 * This provides a cross-domain storage solution for TON Connect.
 * It stores wallet connection data on the server, keyed by a session ID.
 * This allows the wallet state to persist across domain redirects.
 */

export interface ITonConnectStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

const SESSION_ID_KEY = 'ton_session_id';
const API_BASE = '/api/ton-session';

export class TonSessionStorage implements ITonConnectStorage {
  private sessionId: string | null = null;
  private pendingWrites: Map<string, string> = new Map();
  private initialized = false;

  constructor() {
    // Try to restore session ID from URL or localStorage
    this.restoreSessionId();
  }

  private restoreSessionId(): void {
    // First, check URL for session ID (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('tonSession');
    
    if (urlSessionId) {
      console.log('[TonSessionStorage] Found session ID in URL:', urlSessionId);
      this.sessionId = urlSessionId;
      // Store it in localStorage for later use
      try {
        localStorage.setItem(SESSION_ID_KEY, urlSessionId);
      } catch (e) {
        console.warn('[TonSessionStorage] Could not save session ID to localStorage');
      }
      // Clean up URL
      urlParams.delete('tonSession');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    // Otherwise, try localStorage
    try {
      const stored = localStorage.getItem(SESSION_ID_KEY);
      if (stored) {
        console.log('[TonSessionStorage] Restored session ID from localStorage:', stored);
        this.sessionId = stored;
      }
    } catch (e) {
      console.warn('[TonSessionStorage] Could not read session ID from localStorage');
    }
  }

  public async ensureSession(): Promise<string> {
    if (this.sessionId) {
      return this.sessionId;
    }
    
    try {
      const response = await fetch(`${API_BASE}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }
      
      const data = await response.json();
      this.sessionId = data.sessionId;
      
      // Store in localStorage
      try {
        localStorage.setItem(SESSION_ID_KEY, this.sessionId!);
      } catch (e) {
        console.warn('[TonSessionStorage] Could not save session ID to localStorage');
      }
      
      console.log('[TonSessionStorage] Created new session:', this.sessionId);
      return this.sessionId!;
    } catch (error) {
      console.error('[TonSessionStorage] Error creating session:', error);
      // Fall back to a random ID (won't persist across domains but won't crash)
      this.sessionId = 'local-' + Math.random().toString(36).substring(2);
      return this.sessionId;
    }
  }

  public getSessionId(): string | null {
    return this.sessionId;
  }

  public getReturnUrlWithSession(baseUrl: string): string {
    if (!this.sessionId) {
      return baseUrl;
    }
    const url = new URL(baseUrl);
    url.searchParams.set('tonSession', this.sessionId);
    return url.toString();
  }

  async setItem(key: string, value: string): Promise<void> {
    // Also store locally for immediate access
    try {
      localStorage.setItem(`ton_${key}`, value);
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Store on server if we have a session
    if (this.sessionId && !this.sessionId.startsWith('local-')) {
      try {
        await fetch(`${API_BASE}/${this.sessionId}/set`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        });
      } catch (error) {
        console.warn('[TonSessionStorage] Error storing item on server:', error);
      }
    }
  }

  async getItem(key: string): Promise<string | null> {
    // First try server if we have a session from URL (cross-domain case)
    if (this.sessionId && !this.sessionId.startsWith('local-')) {
      try {
        const response = await fetch(`${API_BASE}/${this.sessionId}/get/${encodeURIComponent(key)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.value !== null) {
            console.log('[TonSessionStorage] Retrieved from server:', key);
            return data.value;
          }
        }
      } catch (error) {
        console.warn('[TonSessionStorage] Error fetching from server:', error);
      }
    }
    
    // Fall back to localStorage
    try {
      return localStorage.getItem(`ton_${key}`);
    } catch (e) {
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    // Remove from localStorage
    try {
      localStorage.removeItem(`ton_${key}`);
    } catch (e) {
      // Ignore
    }
    
    // Remove from server
    if (this.sessionId && !this.sessionId.startsWith('local-')) {
      try {
        await fetch(`${API_BASE}/${this.sessionId}/remove/${encodeURIComponent(key)}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.warn('[TonSessionStorage] Error removing from server:', error);
      }
    }
  }

  async syncFromServer(): Promise<void> {
    if (!this.sessionId || this.sessionId.startsWith('local-')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/${this.sessionId}/all`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log('[TonSessionStorage] Syncing data from server:', Object.keys(data.data));
          for (const [key, value] of Object.entries(data.data)) {
            try {
              localStorage.setItem(`ton_${key}`, value as string);
            } catch (e) {
              // Ignore localStorage errors
            }
          }
        }
      }
    } catch (error) {
      console.warn('[TonSessionStorage] Error syncing from server:', error);
    }
  }
}

// Singleton instance
let sessionStorageInstance: TonSessionStorage | null = null;

export function getTonSessionStorage(): TonSessionStorage {
  if (!sessionStorageInstance) {
    sessionStorageInstance = new TonSessionStorage();
  }
  return sessionStorageInstance;
}
