'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Person, AppState, AppActions } from '@/lib/types';
import * as storage from '@/lib/storage';
import * as paymentLogic from '@/lib/paymentLogic';
import * as exportImport from '@/lib/exportImport';

/**
 * PayCoffee App Context
 * Global state management for the entire application
 */

interface AppContextType extends AppState, AppActions {}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize state with client-side data check
  const [persons, setPersons] = useState<Person[]>(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      try {
        return storage.loadPersons();
      } catch (error) {
        console.error('Failed to load initial persons:', error);
        return [];
      }
    }
    return [];
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
  const [infoViewOpen, setInfoViewOpen] = useState(false);
  const [exportImportMenuOpen, setExportImportMenuOpen] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState<Person | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
    // Load data on mount if not already loaded
    if (persons.length === 0) {
      const loadedPersons = storage.loadPersons();
      if (loadedPersons.length > 0) {
        setPersons(loadedPersons);
      }
    }
  }, []);

  // Save data whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      storage.savePersons(persons);
    }
  }, [persons]);

  // Add a new person
  const addPerson = useCallback((name: string) => {
    const newPerson: Person = {
      id: storage.generateId(),
      name: name.trim(),
      credits: 0,
      date: '',
      checked: false,
    };

    setPersons((prev) => [...prev, newPerson]);
    setAddPersonDialogOpen(false);
  }, []);

  // Remove a person
  const removePerson = useCallback((id: string) => {
    setPersons((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Update person details
  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setPersons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Toggle person selection
  const toggleCheck = useCallback((id: string) => {
    setPersons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  }, []);

  // Check all persons
  const checkAll = useCallback(() => {
    setPersons((prev) => prev.map((p) => ({ ...p, checked: true })));
  }, []);

  // Uncheck all persons
  const uncheckAll = useCallback(() => {
    setPersons((prev) => prev.map((p) => ({ ...p, checked: false })));
  }, []);

  // Process payment
  const processPayment = useCallback((payerId: string) => {
    setPersons((prev) => paymentLogic.processPayment(prev, payerId));
    setPaymentDialogOpen(false);
    setSelectedPayer(null);
  }, []);

  // Set edit mode
  const setEditMode = useCallback((enabled: boolean) => {
    setIsEditMode(enabled);
    if (!enabled) {
      // Uncheck all when exiting edit mode
      uncheckAll();
    }
  }, [uncheckAll]);

  // Open payment dialog
  const openPaymentDialog = useCallback((payer: Person) => {
    setSelectedPayer(payer);
    setPaymentDialogOpen(true);
  }, []);

  // Close payment dialog
  const closePaymentDialog = useCallback(() => {
    setPaymentDialogOpen(false);
    setSelectedPayer(null);
  }, []);

  // Open add person dialog
  const openAddPersonDialog = useCallback(() => {
    setAddPersonDialogOpen(true);
  }, []);

  // Close add person dialog
  const closeAddPersonDialog = useCallback(() => {
    setAddPersonDialogOpen(false);
  }, []);

  // Open info view
  const openInfoView = useCallback(() => {
    setInfoViewOpen(true);
  }, []);

  // Close info view
  const closeInfoView = useCallback(() => {
    setInfoViewOpen(false);
  }, []);

  // Open export/import menu
  const openExportImportMenu = useCallback(() => {
    setExportImportMenuOpen(true);
  }, []);

  // Close export/import menu
  const closeExportImportMenu = useCallback(() => {
    setExportImportMenuOpen(false);
  }, []);

  // Export to CSV
  const exportToCSV = useCallback((): string => {
    return exportImport.exportToCSV(persons);
  }, [persons]);

  // Import from CSV
  const importFromCSV = useCallback((csvData: string): boolean => {
    const result = exportImport.importFromCSV(csvData);

    if (result.success && result.persons) {
      setPersons(result.persons);
      return true;
    }

    return false;
  }, []);

  // Auto sort persons
  const autoSort = useCallback(() => {
    setPersons((prev) => paymentLogic.autoSortPersons(prev));
  }, []);

  // Reset to default data (iOS original default values)
  const resetToDefault = useCallback(() => {
    const defaultPersons: Person[] = [
      {
        id: 'tony-default',
        name: 'Tony',
        credits: 1,
        date: '2012-10-28',
        checked: false,
      },
      {
        id: 'peter-default',
        name: 'Peter',
        credits: 2,
        date: '2012-10-29',
        checked: false,
      },
      {
        id: 'phil-default',
        name: 'Phil',
        credits: -3,
        date: '2012-10-18',
        checked: false,
      },
      {
        id: 'mike-default',
        name: 'Mike',
        credits: 0,
        date: '',
        checked: false,
      },
    ];
    setPersons(defaultPersons);
  }, []);

  // Reorder persons (drag & drop)
  const reorderPersons = useCallback((fromIndex: number, toIndex: number) => {
    setPersons((prev) => {
      const newPersons = [...prev];
      const [removed] = newPersons.splice(fromIndex, 1);
      newPersons.splice(toIndex, 0, removed);
      return newPersons;
    });
  }, []);

  const value: AppContextType = {
    // State
    persons,
    isEditMode,
    paymentDialogOpen,
    addPersonDialogOpen,
    infoViewOpen,
    exportImportMenuOpen,
    selectedPayer,

    // Actions
    addPerson,
    removePerson,
    updatePerson,
    toggleCheck,
    checkAll,
    uncheckAll,
    processPayment,
    setEditMode,
    openPaymentDialog,
    closePaymentDialog,
    openAddPersonDialog,
    closeAddPersonDialog,
    openInfoView,
    closeInfoView,
    openExportImportMenu,
    closeExportImportMenu,
    exportToCSV,
    importFromCSV,
    autoSort,
    resetToDefault,
    reorderPersons,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
