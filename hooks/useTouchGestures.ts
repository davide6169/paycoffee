'use client';

import { useCallback, useRef, useState } from 'react';
import { GESTURE_CONFIGS } from '@/lib/constants';

/**
 * Custom hook for touch gesture handling
 * Handles single tap, double tap, and long press
 */
export interface TouchGestureHandlers {
  onSingleTap?: (event: React.MouseEvent | React.TouchEvent) => void;
  onDoubleTap?: (event: React.MouseEvent | React.TouchEvent) => void;
  onLongPress?: (event: React.MouseEvent | React.TouchEvent) => void;
}

export const useTouchGestures = (handlers: TouchGestureHandlers) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      clearTimers();

      // Start long press timer
      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          setIsLongPressing(true);
          handlers.onLongPress?.(event);
        }, GESTURE_CONFIGS.LONG_PRESS_DELAY);
      }

      // Handle tap counting
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTimeRef.current;

      if (timeSinceLastTap < GESTURE_CONFIGS.DOUBLE_TAP_DELAY) {
        // Double tap detected
        tapCountRef.current = 2;
        clearTimers();
        handlers.onDoubleTap?.(event);
        lastTapTimeRef.current = 0;
        tapCountRef.current = 0;
      } else {
        // Potential single tap
        tapCountRef.current = 1;
        lastTapTimeRef.current = now;

        // Wait to see if it's a double tap
        tapTimerRef.current = setTimeout(() => {
          if (tapCountRef.current === 1) {
            handlers.onSingleTap?.(event);
          }
          tapCountRef.current = 0;
          lastTapTimeRef.current = 0;
        }, GESTURE_CONFIGS.DOUBLE_TAP_DELAY);
      }
    },
    [handlers, clearTimers]
  );

  const handleEnd = useCallback(() => {
    clearTimers();
    setIsLongPressing(false);
  }, [clearTimers]);

  const handleMove = useCallback(() => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevent default to avoid interference
      event.preventDefault();
      event.stopPropagation();

      handleStart(event);
      handleEnd();
    },
    [handleStart, handleEnd]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      handleStart(event);
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      handleEnd();
    },
    [handleEnd]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      handleMove();
    },
    [handleMove]
  );

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  return {
    // Event handlers
    onClick: handleClick,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,

    // State
    isLongPressing,

    // Cleanup
    cleanup,
  };
};

/**
 * Simplified tap handler for single/double tap only
 */
export const useTapHandler = (
  onSingleTap: (event: React.MouseEvent) => void,
  onDoubleTap?: (event: React.MouseEvent) => void
) => {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      tapCountRef.current += 1;

      if (tapCountRef.current === 2) {
        // Double tap
        clearTimeout(tapTimerRef.current!);
        onDoubleTap?.(event);
        tapCountRef.current = 0;
      } else {
        // Potential single tap - wait for double tap
        tapTimerRef.current = setTimeout(() => {
          onSingleTap(event);
          tapCountRef.current = 0;
        }, GESTURE_CONFIGS.DOUBLE_TAP_DELAY);
      }
    },
    [onSingleTap, onDoubleTap]
  );

  // Cleanup
  const cleanup = useCallback(() => {
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }
  }, []);

  return {
    onClick: handleClick,
    cleanup,
  };
};
