import { useState, useEffect } from 'react';
import { dataManager, DATA_KEYS } from '../lib/dataManager';
import { Wifi, RefreshCw } from 'lucide-react';

export default function DebugSync() {
  const [isVisible, setIsVisible] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ [key: string]: number }>({});
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Listen for keyboard shortcut to toggle debug panel
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Subscribe to all data changes
    const unsubscribes = Object.values(DATA_KEYS).map(key => 
      dataManager.subscribe(key, (data) => {
        setSyncStatus(prev => ({
          ...prev,
          [key]: data?.length || 0
        }));
        setLastUpdate(new Date().toLocaleTimeString());
      })
    );

    // Initial sync status
    Object.values(DATA_KEYS).forEach(key => {
      const data = dataManager.getData(key);
      setSyncStatus(prev => ({
        ...prev,
        [key]: data?.length || 0
      }));
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [isVisible]);

  const testSync = () => {
    const testItem = {
      _id: `test_${Date.now()}`,
      name: `Test Item ${new Date().toLocaleTimeString()}`,
      description: 'Test sync item',
      price: Math.floor(Math.random() * 500) + 100,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      category: 'Test',
      is_available: true,
    };

    const currentItems = dataManager.getData(DATA_KEYS.MENU_ITEMS) || [];
    dataManager.setData(DATA_KEYS.MENU_ITEMS, [...currentItems, testItem]);
  };

  const clearTestData = () => {
    const currentItems = dataManager.getData(DATA_KEYS.MENU_ITEMS) || [];
    const filteredItems = currentItems.filter((item: any) => !item.category || item.category !== 'Test');
    dataManager.setData(DATA_KEYS.MENU_ITEMS, filteredItems);
  };

  const forceSync = () => {
    dataManager.forceSyncAll();
    setLastUpdate(new Date().toLocaleTimeString());
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
          Press Ctrl+Shift+D for Debug
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 z-50 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">🔄 Sync Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <div className="flex items-center">
            <Wifi className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Connected</span>
          </div>
        </div>

        {lastUpdate && (
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span className="text-blue-600">{lastUpdate}</span>
          </div>
        )}

        <div className="border-t pt-2">
          <div className="font-medium mb-1">Data Counts:</div>
          {Object.entries(DATA_KEYS).map(([name, key]) => (
            <div key={key} className="flex justify-between">
              <span>{name}:</span>
              <span className="font-mono">{syncStatus[key] || 0}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 space-y-1">
          <button
            onClick={testSync}
            className="w-full bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
          >
            Add Test Item
          </button>
          <button
            onClick={clearTestData}
            className="w-full bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
          >
            Clear Test Data
          </button>
          <button
            onClick={forceSync}
            className="w-full bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 flex items-center justify-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Force Sync
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Open another tab to test cross-tab sync
        </div>
      </div>
    </div>
  );
}