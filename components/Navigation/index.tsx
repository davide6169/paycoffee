'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * Navigation Component
 * Top navigation bar with Info and Edit buttons
 */
export const Navigation: React.FC = () => {
  const { isEditMode, setEditMode, openInfoView, openExportImportMenu } = useApp();

  const handleEditPress = () => {
    if (isEditMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  return (
    <nav className="navigation">
      {/* Left side - Info/Actions buttons */}
      <div className="flex items-center">
        {!isEditMode && (
          <button
            className="info-button navigation-button"
            onClick={openInfoView}
            aria-label="Info"
          >
            i
          </button>
        )}

        {isEditMode && (
          <button
            className="navigation-button action-icon-button actions-button"
            onClick={openExportImportMenu}
            aria-label="Actions"
            title="Actions"
          >
            <span className="action-icon">⎋</span>
          </button>
        )}
      </div>

      {/* Centered title */}
      <h1 className="navigation-title">
        PayCoffee
      </h1>

      {/* Right side - Edit button */}
      <div className="flex items-center">
        <button
          className={`navigation-button ${isEditMode ? 'done-button' : 'edit-button'}`}
          onClick={handleEditPress}
          aria-label={isEditMode ? 'Done' : 'Edit'}
          style={{ minWidth: '60px' }}
        >
          {isEditMode ? 'Done' : 'Edit'}
        </button>
      </div>
    </nav>
  );
};
