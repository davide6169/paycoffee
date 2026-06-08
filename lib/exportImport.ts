import { Person, ExportData, CSVImportResult } from './types';
import { CSV_FORMAT, ITEM_SEPARATOR, DEFAULT_MAIL_BODY } from './constants';

/**
 * CSV EXPORT/IMPORT UTILITIES
 * Compatible with iOS PayCoffee app format
 * Format: name;credits;date
 */

/**
 * Convert Person array to CSV string
 * Format: name;credits;date
 */
export const exportToCSV = (persons: Person[]): string => {
  // Header
  const lines = [`name${ITEM_SEPARATOR}credits${ITEM_SEPARATOR}date`];

  // Data rows
  for (const person of persons) {
    const line = [
      person.name,
      person.credits.toString(),
      person.date || '',
    ].join(ITEM_SEPARATOR);
    lines.push(line);
  }

  return lines.join('\n');
};

/**
 * Parse CSV string to Person array
 * Format: name;credits;date
 */
export const importFromCSV = (csvString: string): CSVImportResult => {
  try {
    const lines = csvString.trim().split('\n');

    if (lines.length === 0) {
      return {
        success: false,
        error: 'CSV file is empty',
      };
    }

    // Parse header (optional, can be skipped)
    const firstLine = lines[0].trim();
    const startIndex = firstLine.toLowerCase().includes('name') ? 1 : 0;

    const persons: Person[] = [];
    const errors: string[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(ITEM_SEPARATOR);

      if (parts.length < 2) {
        errors.push(`Line ${i + 1}: Invalid format (expected 2-3 fields)`);
        continue;
      }

      const name = parts[0].trim();
      const creditsStr = parts[1].trim();
      const date = parts[2] ? parts[2].trim() : '';

      // Validate name
      if (!name) {
        errors.push(`Line ${i + 1}: Name is empty`);
        continue;
      }

      // Validate credits
      const credits = parseInt(creditsStr, 10);
      if (isNaN(credits)) {
        errors.push(`Line ${i + 1}: Invalid credits value "${creditsStr}"`);
        continue;
      }

      // Validate date format (if provided)
      if (date && !isValidDate(date)) {
        errors.push(`Line ${i + 1}: Invalid date format "${date}" (expected YYYY-MM-DD)`);
        continue;
      }

      // Create person object
      persons.push({
        id: generateId(),
        name,
        credits,
        date,
        checked: false,
      });
    }

    if (persons.length === 0) {
      return {
        success: false,
        error: 'No valid persons found in CSV',
      };
    }

    if (errors.length > 0) {
      console.warn('CSV import warnings:', errors);
    }

    return {
      success: true,
      persons,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Validate date format (YYYY-MM-DD)
 */
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;

  // Check format with regex
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Check if it's a valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Generate unique ID for imported persons
 */
const generateId = (): string => {
  return `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    console.error('Clipboard API not available');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Import from clipboard
 */
export const pasteFromClipboard = async (): Promise<string | null> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    console.error('Clipboard API not available');
    return null;
  }

  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to paste from clipboard:', error);
    return null;
  }
};

/**
 * Format timestamp for filename
 */
const formatTimestamp = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `_${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Download CSV file
 */
export const downloadCSV = (persons: Person[], filename = 'paycoffee.csv'): void => {
  // Generate timestamp and add to filename
  const timestamp = formatTimestamp();
  const nameWithoutExt = filename.replace(/\.csv$/i, '');
  const finalFilename = `${nameWithoutExt}${timestamp}.csv`;

  const csv = exportToCSV(persons);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (typeof link.download === 'undefined') {
    console.error('Download not supported');
    return;
  }

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Generate email mailto link for export
 */
export const generateEmailLink = (persons: Person[]): string => {
  const csv = exportToCSV(persons);
  const subject = encodeURIComponent('PayCoffee Data Export');
  const body = encodeURIComponent(`${DEFAULT_MAIL_BODY}\n\n${csv}`);

  return `mailto:?subject=${subject}&body=${body}`;
};

/**
 * Open email client with data
 */
export const openEmailExport = (persons: Person[]): void => {
  const mailtoLink = generateEmailLink(persons);
  window.open(mailtoLink, '_blank');
};

/**
 * Merge imported persons with existing persons
 * - Adds new persons (by name)
 * - Updates existing persons (by name)
 * - Preserves selection state
 */
export const mergePersons = (
  existingPersons: Person[],
  importedPersons: Person[]
): Person[] => {
  const merged = [...existingPersons];

  for (const imported of importedPersons) {
    const existingIndex = merged.findIndex((p) => p.name === imported.name);

    if (existingIndex >= 0) {
      // Update existing person (preserve checked state and id)
      merged[existingIndex] = {
        ...merged[existingIndex],
        credits: imported.credits,
        date: imported.date,
      };
    } else {
      // Add new person
      merged.push({
        ...imported,
        checked: false,
      });
    }
  }

  return merged;
};

/**
 * Replace all persons with imported data
 */
export const replacePersons = (importedPersons: Person[]): Person[] => {
  return importedPersons.map((p) => ({
    ...p,
    id: generateId(),
    checked: false,
  }));
};

/**
 * Validate person name
 */
export const validatePersonName = (name: string): boolean => {
  const trimmed = name.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed.length > 50) {
    return false;
  }

  // Check for invalid characters
  if (trimmed.includes(ITEM_SEPARATOR)) {
    return false;
  }

  return true;
};

/**
 * Format person name for display
 */
export const formatPersonName = (name: string): string => {
  return name.trim();
};
