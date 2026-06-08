import { Person, PaymentResult } from './types';
import { PAYMENT_CONFIG } from './constants';

/**
 * CORE PAYMENT LOGIC - Smart Payment Algorithm
 *
 * This implements the PayCoffee smart payment algorithm:
 * 1. If no manual payer selected, use smart algorithm
 * 2. Smart algorithm selects person with lowest credits
 * 3. If tied, select person with oldest payment date
 * 4. If still tied, select randomly
 * 5. Payer gains (selectedCount - 1) credits
 * 6. Each selected person loses 1 credit
 */

/**
 * Find the best payer using the smart algorithm
 * Rules:
 * 1. Person with lowest credits (among selected)
 * 2. If tied, oldest payment date
 * 3. If still tied, random selection
 */
export const selectSmartPayer = (persons: Person[]): Person | null => {
  // Filter to selected persons (those taking coffee)
  const availablePayers = persons.filter((p) => p.checked);

  if (availablePayers.length === 0) {
    return null;
  }

  // If only one available, return them
  if (availablePayers.length === 1) {
    return availablePayers[0];
  }

  // Sort by credits (ascending), then by date (ascending), then random
  const sorted = [...availablePayers].sort((a, b) => {
    // First by credits (lower is better)
    if (a.credits !== b.credits) {
      return a.credits - b.credits;
    }

    // Then by date (older is better - empty string is oldest)
    if (a.date !== b.date) {
      if (!a.date) return -1;
      if (!b.date) return 1;
      return a.date.localeCompare(b.date);
    }

    // If still tied, use random selection
    return Math.random() - 0.5;
  });

  return sorted[0];
};

/**
 * Calculate payment result
 * Returns the payment details before applying
 */
export const calculatePayment = (
  persons: Person[],
  payerId: string
): PaymentResult | null => {
  const payer = persons.find((p) => p.id === payerId);
  if (!payer) {
    return null;
  }

  const selectedPersons = persons.filter((p) => p.checked);
  const selectedCount = selectedPersons.length;

  if (selectedCount === 0) {
    return null;
  }

  // Check if payer is also taking coffee
  const payerIsSelected = persons.some((p) => p.id === payerId && p.checked);

  // Payer gains credits:
  // - If payer takes coffee: gains (selectedCount - 1) credits
  // - If payer doesn't take coffee: gains selectedCount credits
  const creditsChange = payerIsSelected ? (selectedCount - 1) : selectedCount;

  return {
    payerId,
    payerName: payer.name,
    selectedCount,
    amount: selectedCount,
    creditsChange,
  };
};

/**
 * Process a payment and return updated persons list
 * This applies the credit changes to all affected persons
 */
export const processPayment = (
  persons: Person[],
  payerId: string
): Person[] => {
  const selectedCount = persons.filter((p) => p.checked).length;

  if (selectedCount === 0) {
    return persons;
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Check if payer is also taking coffee
  const payerIsSelected = persons.some((p) => p.id === payerId && p.checked);

  return persons.map((person) => {
    if (person.id === payerId) {
      // Payer gains credits:
      // - If payer takes coffee: gains (selectedCount - 1) credits
      // - If payer doesn't take coffee: gains selectedCount credits
      const creditsGain = payerIsSelected ? (selectedCount - 1) : selectedCount;
      return {
        ...person,
        credits: person.credits + creditsGain,
        date: today,
        checked: false,
      };
    } else if (person.checked) {
      // Selected persons lose 1 credit
      return {
        ...person,
        credits: person.credits - 1,
        date: today,
        checked: false,
      };
    } else {
      // Unselected persons unchanged
      return {
        ...person,
        checked: false,
      };
    }
  });
};

/**
 * Get credit indicator type based on credit value
 */
export const getCreditIndicatorType = (
  credits: number
): 'positive' | 'negative' | 'neutral' => {
  if (credits > 0) return 'positive';
  if (credits < 0) return 'negative';
  return 'neutral';
};

/**
 * Format credit display text
 */
export const formatCredits = (credits: number): string => {
  if (credits === 0) return '0';
  const absCredits = Math.abs(credits);
  const plural = absCredits === 1 ? 'credit' : 'credits';
  return credits > 0 ? `+${absCredits} ${plural}` : `-${absCredits} ${plural}`;
};

/**
 * Format date display
 */
export const formatDate = (date: string): string => {
  if (!date) return '';

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    // Format as YYYY-MM-DD for display
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

/**
 * Validate payment state
 * Checks if a payment can be processed
 */
export const validatePayment = (persons: Person[]): {
  valid: boolean;
  error?: string;
  payer?: Person;
} => {
  const selectedCount = persons.filter((p) => p.checked).length;

  if (selectedCount === 0) {
    return {
      valid: false,
      error: 'No persons selected. Select at least one person to pay.',
    };
  }

  // Find smart payer among selected persons
  const payer = selectSmartPayer(persons);
  if (!payer) {
    return {
      valid: false,
      error: 'No payer available. No persons are selected.',
    };
  }

  return {
    valid: true,
    payer,
  };
};

/**
 * Auto-sort persons by credits (descending), then by date (descending)
 * Higher credits first, then more recent dates first
 */
export const autoSortPersons = (persons: Person[]): Person[] => {
  return [...persons].sort((a, b) => {
    // First by credits (descending - higher credits first)
    if (a.credits !== b.credits) {
      return b.credits - a.credits;
    }

    // Then by date (descending - more recent dates first)
    if (a.date !== b.date) {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    }

    // Finally by name (alphabetically)
    return a.name.localeCompare(b.name);
  });
};

/**
 * Check if persons list has changes (for dirty state)
 */
export const hasPersonsChanged = (
  original: Person[],
  current: Person[]
): boolean => {
  if (original.length !== current.length) {
    return true;
  }

  return original.some((orig, index) => {
    const curr = current[index];
    return (
      orig.id !== curr.id ||
      orig.name !== curr.name ||
      orig.credits !== curr.credits ||
      orig.date !== curr.date ||
      orig.checked !== curr.checked
    );
  });
};

/**
 * Get payment statistics
 */
export const getPaymentStats = (persons: Person[]) => {
  const totalCredits = persons.reduce((sum, p) => sum + p.credits, 0);
  const maxCredits = Math.max(...persons.map((p) => p.credits));
  const minCredits = Math.min(...persons.map((p) => p.credits));
  const avgCredits = persons.length > 0 ? totalCredits / persons.length : 0;

  return {
    totalPersons: persons.length,
    totalCredits,
    maxCredits,
    minCredits,
    avgCredits: Math.round(avgCredits * 100) / 100,
  };
};
