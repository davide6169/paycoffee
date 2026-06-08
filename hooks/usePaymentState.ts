'use client';

import { useCallback, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Person, PaymentResult } from '@/lib/types';
import * as paymentLogic from '@/lib/paymentLogic';

/**
 * Custom hook for payment state management
 * Handles payment validation, calculation, and execution
 */
export const usePaymentState = () => {
  const { persons, processPayment, openPaymentDialog } = useApp();

  // Get selected count
  const selectedCount = useMemo(() => {
    return persons.filter((p) => p.checked).length;
  }, [persons]);

  // Validate payment state
  const validation = useMemo(() => {
    return paymentLogic.validatePayment(persons);
  }, [persons]);

  // Can process payment?
  const canPay = useMemo(() => {
    return validation.valid && selectedCount > 0;
  }, [validation, selectedCount]);

  // Get smart payer
  const smartPayer = useMemo(() => {
    if (!validation.valid || !validation.payer) {
      return null;
    }
    return validation.payer;
  }, [validation]);

  // Calculate payment result
  const calculatePayment = useCallback((payerId: string): PaymentResult | null => {
    return paymentLogic.calculatePayment(persons, payerId);
  }, [persons]);

  // Process payment with smart payer
  const processSmartPayment = useCallback(() => {
    if (!smartPayer) {
      return;
    }

    const result = calculatePayment(smartPayer.id);
    if (result) {
      openPaymentDialog(smartPayer);
    }
  }, [smartPayer, calculatePayment, openPaymentDialog]);

  // Process payment with manual payer
  const processManualPayment = useCallback((payerId: string) => {
    const result = calculatePayment(payerId);
    if (result) {
      const payer = persons.find((p) => p.id === payerId);
      if (payer) {
        openPaymentDialog(payer);
      }
    }
  }, [persons, calculatePayment, openPaymentDialog]);

  // Confirm and execute payment
  const confirmPayment = useCallback((payerId: string) => {
    processPayment(payerId);
  }, [processPayment]);

  // Get credit change description
  const getCreditChangeDescription = useCallback((payer: Person): string => {
    const selectedCount = persons.filter((p) => p.checked).length;
    const creditsChange = selectedCount - 1;

    if (creditsChange === 0) {
      return 'No credit change';
    }

    const sign = creditsChange > 0 ? '+' : '';
    return `${sign}${creditsChange} credit${Math.abs(creditsChange) !== 1 ? 's' : ''}`;
  }, [persons]);

  return {
    // State
    selectedCount,
    canPay,
    smartPayer,
    validation,
    validationError: validation.error,

    // Actions
    processSmartPayment,
    processManualPayment,
    confirmPayment,
    calculatePayment,
    getCreditChangeDescription,
  };
};
