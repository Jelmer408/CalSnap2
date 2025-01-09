import { useCallback, useRef, TouchEvent } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeNavigation({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 50 
}: SwipeConfig) {
  const touchStart = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStart.current === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchEnd - touchStart.current;

    if (Math.abs(distance) < threshold) return;

    if (distance > 0 && onSwipeRight) {
      onSwipeRight();
    } else if (distance < 0 && onSwipeLeft) {
      onSwipeLeft();
    }

    touchStart.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handleTouchStart,
    handleTouchEnd
  };
}
