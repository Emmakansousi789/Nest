"use client";

import { useRef, useCallback, ReactNode } from "react";

interface SwipeBackProps {
  onBack: () => void;
  children: ReactNode;
  threshold?: number;
}

export default function SwipeBack({ onBack, children, threshold = 80 }: SwipeBackProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    // Only activate from left edge (first 20px)
    if (x < 20) {
      startX.current = x;
      startY.current = e.touches[0].clientY;
      swiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX.current;
    const deltaY = Math.abs(endY - startY.current);
    // Only trigger if primarily horizontal and exceeds threshold
    if (deltaX > threshold && deltaY < 100) {
      onBack();
    }
    swiping.current = false;
  }, [onBack, threshold]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-full"
    >
      {children}
    </div>
  );
}
