// Enhanced cross-tab synchronization using multiple methods
export class CrossTabSync {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  constructor() {
    // Try to use BroadcastChannel API if available (modern browsers)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('restaurant-sync');
        this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage.bind(this));
      } catch (error) {
        console.warn('BroadcastChannel not available:', error);
      }
    }

    // Fallback to storage events
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    
    // Also listen for focus events to sync when tab becomes active
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
  }

  private handleBroadcastMessage(event: MessageEvent) {
    const { type, key, data } = event.data;
    if (type === 'DATA_UPDATE') {
      this.notifyListeners(key, data);
    }
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key && event.newValue && !event.key.endsWith('_trigger')) {
      try {
        const data = JSON.parse(event.newValue);
        this.notifyListeners(event.key, data);
      } catch (error) {
        console.warn('Failed to parse storage data:', error);
      }
    }
  }

  private handleWindowFocus() {
    // When tab becomes active, sync all data
    setTimeout(() => {
      this.syncAllData();
    }, 100);
  }

  private notifyListeners(key: string, data: any) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.warn('Error in sync listener:', error);
        }
      });
    }
  }

  subscribe(key: string, callback: (data: any) => void) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);

    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  broadcast(key: string, data: any) {
    // Method 1: BroadcastChannel (if available)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'DATA_UPDATE',
          key,
          data,
          timestamp: Date.now()
        });
      } catch (error) {
        console.warn('BroadcastChannel error:', error);
      }
    }

    // Method 2: Storage events (fallback)
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      
      // Trigger storage event manually
      const triggerKey = key + '_sync_trigger';
      localStorage.removeItem(triggerKey);
      localStorage.setItem(triggerKey, Date.now().toString());
    } catch (error) {
      console.warn('Storage sync error:', error);
    }

    // Method 3: Custom event for same tab
    window.dispatchEvent(new CustomEvent('cross-tab-sync', {
      detail: { key, data }
    }));
  }

  private syncAllData() {
    // Sync all known data keys
    const keys = ['menu_items', 'user_orders', 'user_reservations', 'restaurant_tables', 'customer_reviews'];
    
    keys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          this.notifyListeners(key, parsedData);
        }
      } catch (error) {
        console.warn(`Failed to sync ${key}:`, error);
      }
    });
  }

  // Force sync for debugging
  forceSyncAll() {
    this.syncAllData();
  }
}

export const crossTabSync = new CrossTabSync();

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).crossTabSync = crossTabSync;
}