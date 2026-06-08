'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePersonList } from '@/hooks/usePersonList';
import { useState } from 'react';

/**
 * ExportImportMenu Component
 * Action sheet for export/import options
 */
export const ExportImportMenu: React.FC = () => {
  const { exportImportMenuOpen, closeExportImportMenu, resetToDefault } = useApp();
  const {
    exportToClipboard,
    exportToFile,
    exportToEmail,
    importFromClipboard,
    persons,
  } = usePersonList();

  const [confirmationDialog, setConfirmationDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationDialog({ show: true, title, message, onConfirm });
  };

  const closeConfirmation = () => {
    setConfirmationDialog({ show: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleExportToClipboard = async () => {
    const hasData = persons.length > 0;
    if (!hasData) {
      showConfirmation(
        'No data to export',
        '',
        () => {
          closeConfirmation();
        }
      );
      return;
    }

    const success = await exportToClipboard();
    if (success) {
      showConfirmation(
        'Export Complete',
        '',
        () => {
          closeConfirmation();
          closeExportImportMenu();
        }
      );
    }
  };

  const handleExportToFile = () => {
    exportToFile();
    closeExportImportMenu();
  };

  const handleExportToEmail = () => {
    if (persons.length === 0) {
      showConfirmation(
        'No data to export',
        '',
        () => {
          closeConfirmation();
        }
      );
      return;
    }

    exportToEmail();
    closeExportImportMenu();
  };

  const handleImportFromClipboard = async () => {
    // Show confirmation first
    showConfirmation(
      'Confirm Import?',
      '',
      () => {
        // After confirmation, try to import
        importFromClipboard().then((success) => {
          if (!success) {
            // Show error popup
            showConfirmation(
              'Data is not valid',
              '',
              () => {
                closeConfirmation();
              }
            );
          } else {
            // Success - close menus
            closeConfirmation();
            closeExportImportMenu();
          }
        });
      }
    );
  };

  const handleResetData = () => {
    showConfirmation(
      'Confirm Reset?',
      '',
      () => {
        resetToDefault();
        closeConfirmation();
        closeExportImportMenu();
      }
    );
  };

  // Auto-focus OK button when confirmation dialog opens
  useEffect(() => {
    if (confirmationDialog.show) {
      const okButton = document.querySelector('.confirmation-dialog .action-sheet-cancel') as HTMLElement;
      okButton?.focus();
    }
  }, [confirmationDialog.show]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmationDialog.show) {
          closeConfirmation();
        } else if (exportImportMenuOpen) {
          closeExportImportMenu();
        }
        return;
      }

      if (!confirmationDialog.show && exportImportMenuOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const buttons = document.querySelectorAll('.action-sheet-button');
          const currentIndex = Array.from(buttons).indexOf(document.activeElement as HTMLElement);
          const nextIndex = e.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, buttons.length - 1)
            : Math.max(currentIndex - 1, 0);
          (buttons[nextIndex] as HTMLElement)?.focus();
        }

        if (e.key === 'Enter') {
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.classList.contains('action-sheet-button')) {
            activeElement.click();
          }
        }
      }

      if (confirmationDialog.show && e.key === 'Enter') {
        confirmationDialog.onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [exportImportMenuOpen, closeExportImportMenu, confirmationDialog]);

  if (!exportImportMenuOpen && !confirmationDialog.show) {
    return null;
  }

  return (
    <>
      {exportImportMenuOpen && (
        <div className="modal-overlay" onClick={closeExportImportMenu}>
          <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-actions">
              <button
                className="action-sheet-button"
                onClick={handleExportToClipboard}
              >
                Export to Clipboard
              </button>

              <button
                className="action-sheet-button"
                onClick={handleExportToFile}
              >
                Export to File
              </button>

              <button
                className="action-sheet-button"
                onClick={handleImportFromClipboard}
              >
                Import from Clipboard
              </button>

              <button
                className="action-sheet-button danger"
                onClick={handleResetData}
              >
                Reset to Default
              </button>
            </div>

            <button
              className="action-sheet-cancel"
              onClick={closeExportImportMenu}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmationDialog.show && (
        <div className="modal-overlay" onClick={closeConfirmation}>
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className={confirmationDialog.message ? "confirmation-title" : "confirmation-title-only"}>
              {confirmationDialog.title}
            </div>
            {confirmationDialog.message && (
              <div className="confirmation-message">
                {confirmationDialog.message}
              </div>
            )}
            <button
              className="action-sheet-cancel"
              onClick={confirmationDialog.onConfirm}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
