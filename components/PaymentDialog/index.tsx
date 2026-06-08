'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * PaymentDialog Component
 * Modal dialog for confirming payment (iOS 2011-2012 style)
 */
export const PaymentDialog: React.FC = () => {
  const { paymentDialogOpen, closePaymentDialog, selectedPayer, processPayment, persons } = useApp();

  // Calculate selected count
  const selectedCount = persons.filter(p => p.checked).length;

  // Auto-focus OK button when dialog opens
  useEffect(() => {
    if (paymentDialogOpen) {
      const okButton = document.querySelector('.payment-dialog .modal-button.primary') as HTMLElement;
      okButton?.focus();
    }
  }, [paymentDialogOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && paymentDialogOpen) {
        closePaymentDialog();
      }
      if (e.key === 'Enter' && paymentDialogOpen) {
        processPayment(selectedPayer?.id || '');
        closePaymentDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paymentDialogOpen, closePaymentDialog, processPayment, selectedPayer]);

  if (!paymentDialogOpen || !selectedPayer) {
    return null;
  }

  const handleConfirm = () => {
    processPayment(selectedPayer.id);
    closePaymentDialog();
  };

  const handleCancel = () => {
    closePaymentDialog();
  };

  // Generate title based on original iOS format
  const title = selectedCount === 1
    ? `Pay ${selectedCount} coffee...`
    : `Pay ${selectedCount} coffees...`;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="payment-dialog confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-title">
          {title}
        </div>
        <div className="confirmation-message">
          {selectedPayer.name}
        </div>
        <div className="modal-actions">
          <button
            className="modal-button secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="modal-button primary"
            onClick={handleConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
