'use client';

import { useCallback, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Person } from '@/lib/types';
import * as exportImport from '@/lib/exportImport';

/**
 * Custom hook for person list operations
 * Handles list management, selection, and editing
 */
export const usePersonList = () => {
  const {
    persons,
    addPerson,
    removePerson,
    updatePerson,
    toggleCheck,
    checkAll,
    uncheckAll,
    reorderPersons,
    exportToCSV,
    importFromCSV,
  } = useApp();

  // Check if list is empty
  const isEmpty = useMemo(() => {
    return persons.length === 0;
  }, [persons.length]);

  // Check if all are selected
  const allSelected = useMemo(() => {
    return persons.length > 0 && persons.every((p) => p.checked);
  }, [persons]);

  // Check if any are selected
  const anySelected = useMemo(() => {
    return persons.some((p) => p.checked);
  }, [persons]);

  // Get selected persons
  const selectedPersons = useMemo(() => {
    return persons.filter((p) => p.checked);
  }, [persons]);

  // Get unselected persons
  const unselectedPersons = useMemo(() => {
    return persons.filter((p) => !p.checked);
  }, [persons]);

  // Toggle person selection
  const handleToggleCheck = useCallback(
    (id: string) => {
      toggleCheck(id);
    },
    [toggleCheck]
  );

  // Toggle select all / deselect all
  const handleToggleSelectAll = useCallback(() => {
    if (allSelected) {
      uncheckAll();
    } else {
      checkAll();
    }
  }, [allSelected, checkAll, uncheckAll]);

  // Add new person with validation
  const handleAddPerson = useCallback(
    (name: string): boolean => {
      if (!exportImport.validatePersonName(name)) {
        return false;
      }

      // Check for duplicate names
      const trimmedName = exportImport.formatPersonName(name);
      const exists = persons.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase());

      if (exists) {
        return false;
      }

      addPerson(trimmedName);
      return true;
    },
    [addPerson, persons]
  );

  // Remove person with confirmation
  const handleRemovePerson = useCallback(
    (id: string) => {
      removePerson(id);
    },
    [removePerson]
  );

  // Update person name with validation
  const handleUpdatePersonName = useCallback(
    (id: string, name: string): boolean => {
      if (!exportImport.validatePersonName(name)) {
        return false;
      }

      // Check for duplicate names (excluding current person)
      const trimmedName = exportImport.formatPersonName(name);
      const exists = persons.some(
        (p) => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (exists) {
        return false;
      }

      updatePerson(id, { name: trimmedName });
      return true;
    },
    [updatePerson, persons]
  );

  // Export list to clipboard
  const handleExportToClipboard = useCallback(async (): Promise<boolean> => {
    const csv = exportToCSV();
    return await exportImport.copyToClipboard(csv);
  }, [exportToCSV]);

  // Export list to file download
  const handleExportToFile = useCallback(() => {
    exportImport.downloadCSV(persons);
  }, [persons]);

  // Export list to email
  const handleExportToEmail = useCallback(() => {
    exportImport.openEmailExport(persons);
  }, [persons]);

  // Import list from clipboard
  const handleImportFromClipboard = useCallback(async (): Promise<boolean> => {
    const text = await exportImport.pasteFromClipboard();
    if (!text) {
      return false;
    }
    return importFromCSV(text);
  }, [importFromCSV]);

  // Get person by ID
  const getPersonById = useCallback(
    (id: string): Person | undefined => {
      return persons.find((p) => p.id === id);
    },
    [persons]
  );

  // Search persons by name
  const searchPersons = useCallback(
    (query: string): Person[] => {
      if (!query.trim()) {
        return persons;
      }

      const lowerQuery = query.toLowerCase();
      return persons.filter((p) => p.name.toLowerCase().includes(lowerQuery));
    },
    [persons]
  );

  // Sort persons by name
  const sortByName = useCallback(() => {
    const sorted = [...persons].sort((a, b) => a.name.localeCompare(b.name));
    // Reorder by sorted order
    sorted.forEach((person, index) => {
      const currentIndex = persons.findIndex((p) => p.id === person.id);
      if (currentIndex !== index) {
        reorderPersons(currentIndex, index);
      }
    });
  }, [persons, reorderPersons]);

  // Get list statistics
  const getStatistics = useCallback(() => {
    const totalCredits = persons.reduce((sum, p) => sum + p.credits, 0);
    const positiveCount = persons.filter((p) => p.credits > 0).length;
    const negativeCount = persons.filter((p) => p.credits < 0).length;
    const neutralCount = persons.filter((p) => p.credits === 0).length;

    return {
      totalPersons: persons.length,
      totalCredits,
      positiveCount,
      negativeCount,
      neutralCount,
      averageCredits: persons.length > 0 ? totalCredits / persons.length : 0,
    };
  }, [persons]);

  return {
    // State
    persons,
    selectedPersons,
    unselectedPersons,
    isEmpty,
    allSelected,
    anySelected,

    // Actions
    toggleCheck: handleToggleCheck,
    checkAll,
    uncheckAll,
    toggleSelectAll: handleToggleSelectAll,
    addPerson: handleAddPerson,
    removePerson: handleRemovePerson,
    updatePersonName: handleUpdatePersonName,
    reorderPersons,

    // Export/Import
    exportToClipboard: handleExportToClipboard,
    exportToFile: handleExportToFile,
    exportToEmail: handleExportToEmail,
    importFromClipboard: handleImportFromClipboard,

    // Utilities
    getPersonById,
    searchPersons,
    sortByName,
    getStatistics,
  };
};
