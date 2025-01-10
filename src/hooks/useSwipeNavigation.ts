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
  const isScrolling = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    isScrolling.current = false;
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.target instanceof Element) {
      const element = e.target.closest('.overflow-x-auto');
      if (element) {
        isScrolling.current = true;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStart.current === null || isScrolling.current) return;

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
    handleTouchMove,
    handleTouchEnd
  };
}
