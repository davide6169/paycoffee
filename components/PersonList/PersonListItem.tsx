'use client';

import React, { useState, useEffect } from 'react';
import { Person } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { useTapHandler } from '@/hooks/useTouchGestures';
import * as paymentLogic from '@/lib/paymentLogic';
import * as exportImport from '@/lib/exportImport';

interface PersonListItemProps {
  person: Person;
  index: number;
  isEditMode: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  isDragging?: boolean;
  isFocused?: boolean;
}

/**
 * PersonListItem Component
 * Individual person row with credit indicator, name, and checkbox
 */
export const PersonListItem: React.FC<PersonListItemProps> = ({
  person,
  index,
  isEditMode,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isFocused = false,
}) => {
  const { toggleCheck, removePerson, openPaymentDialog } = useApp();
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    personName: string;
    onConfirm: () => void;
  }>({
    show: false,
    personName: '',
    onConfirm: () => {},
  });

  // Handle single tap - toggle selection
  const handleSingleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isEditMode) {
      toggleCheck(person.id);
    }
  };

  // Handle double tap - manual payment
  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isEditMode && !person.checked) {
      openPaymentDialog(person);
    }
  };

  const { onClick } = useTapHandler(handleSingleTap, handleDoubleTap);

  const handleDeletePress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    showDeleteDialog(person.name, person.id);
  };

  const showDeleteDialog = (personName: string, personId: string) => {
    setDeleteDialog({
      show: true,
      personName,
      onConfirm: () => {
        removePerson(personId);
        closeDeleteDialog();
      },
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      show: false,
      personName: '',
      onConfirm: () => {},
    });
  };

  // Handle keyboard navigation for delete dialog
  useEffect(() => {
    if (deleteDialog.show) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeDeleteDialog();
        } else if (e.key === 'Enter') {
          deleteDialog.onConfirm();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [deleteDialog]);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (isEditMode && onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      onDragStart(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditMode && onDragOver) {
      onDragOver(e, index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditMode && onDrop) {
      onDrop(e, index);
    }
  };

  // Touch handlers for mobile drag & drop
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchMoved, setTouchMoved] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditMode || !onDragStart) return;

    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setIsDragging(false);
    setTouchMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isEditMode) return;

    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY);

    // Only start dragging if moved more than 10px vertically
    if (deltaY > 10) {
      setIsDragging(true);
      setTouchMoved(true);
      e.preventDefault(); // Prevent scrolling while dragging
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isEditMode || !isDragging || !onDragStart) {
      setTouchStartY(0);
      setIsDragging(false);
      setTouchMoved(false);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartY;

    // Determine direction and find target element
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetListItem = targetElement?.closest('.person-list-item');

    if (targetListItem) {
      const allItems = Array.from(document.querySelectorAll('.person-list-item'));
      const targetIndex = allItems.indexOf(targetListItem);

      if (targetIndex !== -1 && targetIndex !== index && onDrop) {
        // Create a fake event with the target index
        const fakeEvent = {
          preventDefault: () => {},
        } as any;
        onDrop(fakeEvent, targetIndex);
      }
    }

    setTouchStartY(0);
    setIsDragging(false);
    setTouchMoved(false);
  };

  const creditIndicatorType = paymentLogic.getCreditIndicatorType(person.credits);
  const creditsDisplay = paymentLogic.formatCredits(person.credits);
  const dateDisplay = paymentLogic.formatDate(person.date);

  return (
    <>
      <li
        className={`person-list-item ${person.checked ? 'selected' : ''} ${isEditMode ? 'edit-mode' : ''} ${isDragging ? 'dragging' : ''} ${isFocused ? 'keyboard-focused' : ''}`}
        onClick={onClick}
        draggable={isEditMode}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Delete Icon (visible in edit mode - left side) */}
        {isEditMode && (
          <div
            className="delete-icon"
            onClick={handleDeletePress}
            role="button"
            aria-label={`Remove ${person.name}`}
          >
            −
          </div>
        )}

        <div className="person-item-content">
          {/* Credit Indicator */}
          <div className={`credit-indicator ${creditIndicatorType}`} />

          {/* Person Info */}
          <div className="person-info">
            <div className="person-name">{exportImport.formatPersonName(person.name)}</div>
            <div className="person-credits">
              {dateDisplay && <span>{creditsDisplay} ({dateDisplay})</span>}
              {!dateDisplay && <span>{creditsDisplay}</span>}
            </div>
          </div>

          {/* Checkbox (visible in normal mode) */}
          {!isEditMode && (
            <div className={`checkbox ${person.checked ? 'checked' : ''}`}>
              <div className="checkbox-icon" />
            </div>
          )}
        </div>

        {/* Reorder Icon (visible in edit mode - right side) */}
        {isEditMode && (
          <div className="reorder-icon">
            ≡
          </div>
        )}
      </li>

      {/* Delete confirmation dialog */}
      {deleteDialog.show && (
        <div className="modal-overlay" onClick={closeDeleteDialog}>
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-title">
              Remove {deleteDialog.personName}?
            </div>
            <div className="modal-actions" style={{ gap: '8px' }}>
              <button
                className="modal-button secondary"
                onClick={closeDeleteDialog}
              >
                Cancel
              </button>
              <button
                className="modal-button danger"
                onClick={deleteDialog.onConfirm}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
