import { useState, useEffect } from 'react';
import { dataManager } from '../lib/dataManager';

export function useRealtimeData<T>(key: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(() => {
    const stored = dataManager.getData(key);
    return stored || initialData;
  });

  useEffect(() => {
    // Initialize data if not exists
    if (!dataManager.getData(key)) {
      dataManager.setData(key, initialData);
    }

    // Subscribe to changes
    const unsubscribe = dataManager.subscribe(key, (newData: T[]) => {
      setData(newData);
    });

    return unsubscribe;
  }, [key, initialData]);

  const updateItem = (itemId: string | number, updater: (item: T) => T, idField = '_id') => {
    const updatedData = dataManager.updateArrayItem(key, String(itemId), updater, idField);
    return updatedData;
  };

  const addItem = (item: T) => {
    const updatedData = dataManager.addArrayItem(key, item);
    return updatedData;
  };

  const removeItem = (itemId: string | number, idField = '_id') => {
    const updatedData = dataManager.removeArrayItem(key, String(itemId), idField);
    return updatedData;
  };

  const setAllData = (newData: T[]) => {
    dataManager.setData(key, newData);
    return newData;
  };

  return {
    data,
    updateItem,
    addItem,
    removeItem,
    setAllData,
  };
}