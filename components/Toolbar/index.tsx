'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePaymentState } from '@/hooks/usePaymentState';

/**
 * Toolbar Component
 * Bottom toolbar with Add, Pay, and Select All buttons
 */
export const Toolbar: React.FC = () => {
  const {
    isEditMode,
    openAddPersonDialog,
    checkAll,
    uncheckAll,
    autoSort,
  } = useApp();

  const { canPay, selectedCount, processSmartPayment } = usePaymentState();

  const handlePayPress = () => {
    if (canPay) {
      processSmartPayment();
    }
  };

  const handleSelectAllPress = () => {
    if (selectedCount > 0) {
      uncheckAll();
    } else {
      checkAll();
    }
  };

  const handleSortPress = () => {
    autoSort();
  };

  return (
    <div className="toolbar">
      <button
        className="toolbar-button"
        onClick={openAddPersonDialog}
        aria-label="Add Person"
        style={{ fontSize: '24px', fontWeight: '300', minWidth: '44px' }}
      >
        +
      </button>

      {!isEditMode && (
        <>
          <button
            className="toolbar-button toolbar-button-icon"
            onClick={handlePayPress}
            {...(!canPay && { disabled: true })}
            aria-label="Pay"
          >
            <img src="/images/coffee-cup.png" alt="Pay" className="toolbar-icon" />
          </button>

          <button
            className="toolbar-button toolbar-button-icon"
            onClick={handleSelectAllPress}
            aria-label="Select All"
            title={selectedCount > 0 ? 'Deselect All' : 'Select All'}
          >
            <div className="checkmark-icon">
              ✓
            </div>
          </button>
        </>
      )}

      {isEditMode && (
        <button
          className="toolbar-button toolbar-button-icon"
          onClick={handleSortPress}
          aria-label="Sort List"
          title="Sort List"
        >
          <div className="list-icon">
            <div className="list-item-row">
              <span className="list-number">1</span>
              <div className="list-line"></div>
            </div>
            <div className="list-item-row">
              <span className="list-number">2</span>
              <div className="list-line"></div>
            </div>
            <div className="list-item-row">
              <span className="list-number">3</span>
              <div className="list-line"></div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
