import { Person } from './types';
import { STORAGE_KEYS, DEFAULT_PERSONS } from './constants';

/**
 * localStorage wrapper for PayCoffee data persistence
 */

// Generate a unique ID for new persons
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Load persons from localStorage
export const loadPersons = (): Person[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONS);
    if (!stored) {
      // Initialize with default data on first load
      const defaultPersons = initializeDefaultPersons();
      savePersons(defaultPersons);
      return defaultPersons;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading persons from localStorage:', error);
    return initializeDefaultPersons();
  }
};

// Save persons to localStorage
export const savePersons = (persons: Person[]): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving persons to localStorage:', error);
    return false;
  }
};

// Initialize default persons from constants
const initializeDefaultPersons = (): Person[] => {
  return DEFAULT_PERSONS.map((person) => ({
    id: generateId(),
    name: person.name,
    credits: person.credits,
    date: person.date,
    checked: false,
  }));
};

// Clear all data (reset to defaults)
export const clearAllData = (): Person[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.PERSONS);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    const defaultPersons = initializeDefaultPersons();
    savePersons(defaultPersons);
    return defaultPersons;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return [];
  }
};

// Get last update timestamp
export const getLastUpdate = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
  } catch (error) {
    console.error('Error getting last update:', error);
    return null;
  }
};

// Export data as JSON (for backup/debugging)
export const exportDataAsJSON = (): string => {
  const persons = loadPersons();
  return JSON.stringify(persons, null, 2);
};

// Import data from JSON (for backup/debugging)
export const importDataFromJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: expected an array');
    }

    // Validate that each item has required fields
    const validPersons = data.every((item) => {
      return (
        typeof item === 'object' &&
        typeof item.name === 'string' &&
        typeof item.credits === 'number' &&
        typeof item.checked === 'boolean'
      );
    });

    if (!validPersons) {
      throw new Error('Invalid person data format');
    }

    savePersons(data);
    return true;
  } catch (error) {
    console.error('Error importing data from JSON:', error);
    return false;
  }
};

// Check if localStorage is available
export const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Get storage usage info (for monitoring)
export const getStorageInfo = (): { used: number; available: number } => {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0 };
  }

  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Rough estimate (most browsers have 5-10MB limit)
    const available = 5 * 1024 * 1024; // 5MB in bytes
    return { used, available };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, available: 0 };
  }
};
