'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePersonList } from '@/hooks/usePersonList';
import { PersonListItem } from './PersonListItem';

/**
 * PersonList Component
 * Main container for the list of persons
 */
export const PersonList: React.FC = () => {
  const { isEditMode, reorderPersons, toggleCheck } = useApp();
  const { persons, isEmpty } = usePersonList();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Allow drop
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderPersons(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation when not in edit mode and when there are persons
      if (isEditMode || persons.length === 0) {
        return;
      }

      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null) return 0;
          return Math.min(prev + 1, persons.length - 1);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null) return 0;
          return Math.max(prev - 1, 0);
        });
      } else if (e.key === 'Enter' && focusedIndex !== null) {
        e.preventDefault();
        toggleCheck(persons[focusedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode, persons, focusedIndex, toggleCheck]);

  // Reset focused index when persons list changes
  useEffect(() => {
    setFocusedIndex(null);
  }, [persons.length]);

  if (isEmpty) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">☕</div>
        <div className="empty-state-text">
          No persons yet.<br />
          Tap &quot;Add&quot; to get started!
        </div>
      </div>
    );
  }

  return (
    <ul className="person-list">
      {persons.map((person, index) => (
        <PersonListItem
          key={person.id}
          person={person}
          index={index}
          isEditMode={isEditMode}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
          isFocused={focusedIndex === index}
        />
      ))}
    </ul>
  );
};
