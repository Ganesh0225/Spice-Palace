// Data keys - define first to avoid circular dependency
export const DATA_KEYS = {
  MENU_ITEMS: 'menu_items',
  ORDERS: 'user_orders',
  RESERVATIONS: 'user_reservations',
  TABLES: 'restaurant_tables',
  REVIEWS: 'customer_reviews',
} as const;

// Real-time data synchronization across browser tabs/windows
class DataManager {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};
  private crossTabSync: any = null;

  constructor() {
    // Listen for custom events within the same tab
    window.addEventListener('dataUpdate', this.handleDataUpdate.bind(this) as EventListener);
    window.addEventListener('cross-tab-sync', this.handleCrossTabSync.bind(this) as EventListener);
    
    // Initialize cross-tab sync after construction to avoid circular dependency
    this.initializeCrossTabSync();
  }

  private async initializeCrossTabSync() {
    try {
      // Dynamic import to avoid circular dependency
      const { crossTabSync } = await import('./crossTabSync');
      this.crossTabSync = crossTabSync;
      
      // Subscribe to cross-tab sync for all data keys
      Object.values(DATA_KEYS).forEach(key => {
        crossTabSync.subscribe(key, (data) => {
          this.notifyListeners(key, data);
        });
      });
    } catch (error) {
      console.warn('Failed to initialize cross-tab sync:', error);
    }
  }

  private handleDataUpdate(e: Event) {
    const customEvent = e as CustomEvent;
    const { key, data } = customEvent.detail;
    this.notifyListeners(key, data);
  }

  private handleCrossTabSync(e: Event) {
    const customEvent = e as CustomEvent;
    const { key, data } = customEvent.detail;
    this.notifyListeners(key, data);
  }

  private notifyListeners(key: string, data: any) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.warn('Error in data listener:', error);
        }
      });
    }
  }

  // Subscribe to data changes
  subscribe(key: string, callback: (data: any) => void) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  // Get data from storage
  getData(key: string) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get data:', error);
      return null;
    }
  }

  // Set data and notify all listeners
  setData(key: string, data: any) {
    try {
      const jsonData = JSON.stringify(data);
      
      // Store the data
      localStorage.setItem(key, jsonData);
      
      // Notify listeners in the same tab immediately
      window.dispatchEvent(new CustomEvent('dataUpdate', {
        detail: { key, data }
      }));
      
      // Broadcast to other tabs using enhanced cross-tab sync
      if (this.crossTabSync) {
        this.crossTabSync.broadcast(key, data);
      }
      
    } catch (error) {
      console.warn('Failed to set data:', error);
    }
  }

  // Update specific item in an array
  updateArrayItem(key: string, itemId: string, updater: (item: any) => any, idField = '_id') {
    console.log(`=== UPDATE ARRAY ITEM ===`);
    console.log(`Key: ${key}, ItemId: ${itemId} (${typeof itemId}), IdField: ${idField}`);
    
    const data = this.getData(key) || [];
    console.log('Current data:', data);
    
    let found = false;
    const updatedData = data.map((item: any) => {
      const itemIdValue = item[idField];
      console.log(`Comparing item[${idField}] (${itemIdValue}, ${typeof itemIdValue}) with itemId (${itemId}, ${typeof itemId})`);
      
      // Try both strict and loose equality
      const isMatch = itemIdValue == itemId || itemIdValue === itemId || 
                     String(itemIdValue) === String(itemId) || 
                     Number(itemIdValue) === Number(itemId);
      
      console.log(`Match result: ${isMatch}`);
      
      if (isMatch) {
        found = true;
        const updated = updater(item);
        console.log('Updated item:', updated);
        return updated;
      }
      return item;
    });
    
    console.log(`Found item: ${found}`);
    console.log('Final updated data:', updatedData);
    
    if (found) {
      this.setData(key, updatedData);
    } else {
      console.warn(`Item with ${idField}=${itemId} not found in data`);
    }
    
    return updatedData;
  }

  // Add item to array
  addArrayItem(key: string, item: any) {
    const data = this.getData(key) || [];
    const updatedData = [...data, item];
    this.setData(key, updatedData);
    return updatedData;
  }

  // Remove item from array
  removeArrayItem(key: string, itemId: string, idField = '_id') {
    console.log(`=== REMOVE ARRAY ITEM ===`);
    console.log(`Key: ${key}, ItemId: ${itemId} (${typeof itemId}), IdField: ${idField}`);
    
    const data = this.getData(key) || [];
    console.log('Current data before removal:', data);
    
    const updatedData = data.filter((item: any) => {
      const itemIdValue = item[idField];
      console.log(`Comparing item[${idField}] (${itemIdValue}, ${typeof itemIdValue}) with itemId (${itemId}, ${typeof itemId})`);
      
      // Try both strict and loose equality for removal (keep items that DON'T match)
      const isMatch = itemIdValue == itemId || itemIdValue === itemId || 
                     String(itemIdValue) === String(itemId) || 
                     Number(itemIdValue) === Number(itemId);
      
      console.log(`Match result: ${isMatch}, Keep item: ${!isMatch}`);
      return !isMatch; // Keep items that don't match
    });
    
    console.log('Data after removal:', updatedData);
    console.log(`Removed ${data.length - updatedData.length} items`);
    
    this.setData(key, updatedData);
    return updatedData;
  }

  // Force sync across all tabs (useful for debugging)
  forceSyncAll() {
    if (this.crossTabSync) {
      this.crossTabSync.forceSyncAll();
    }
  }
}

// Create singleton instance
export const dataManager = new DataManager();

// Debug helper - expose to window for testing
if (typeof window !== 'undefined') {
  (window as any).dataManager = dataManager;
  (window as any).DATA_KEYS = DATA_KEYS;
  
  // Add debug function to test sync
  (window as any).testSync = () => {
    console.log('Testing cross-tab sync...');
    dataManager.setData(DATA_KEYS.MENU_ITEMS, [
      { _id: 'test', name: 'Test Item', price: 100, category: 'Test' }
    ]);
    console.log('Test data sent. Check other tabs.');
  };
}