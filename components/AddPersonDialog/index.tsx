'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePersonList } from '@/hooks/usePersonList';

/**
 * AddPersonDialog Component
 * Modal dialog for adding a new person
 */
export const AddPersonDialog: React.FC = () => {
  const { addPersonDialogOpen, closeAddPersonDialog } = useApp();
  const { addPerson } = usePersonList();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addPersonDialogOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [addPersonDialogOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name is too long (max 50 characters)');
      return;
    }

    const success = addPerson(trimmedName);

    if (success) {
      setName('');
      setError('');
      closeAddPersonDialog();
    } else {
      setError('A person with this name already exists');
    }
  };

  const handleCancel = () => {
    setName('');
    setError('');
    closeAddPersonDialog();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!addPersonDialogOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Add Person</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-aligned-container">
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Enter name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              maxLength={50}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}

          <div className="modal-actions form-aligned-container button-row">
            <button
              type="button"
              className="modal-button secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button primary"
              disabled={!name.trim()}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
