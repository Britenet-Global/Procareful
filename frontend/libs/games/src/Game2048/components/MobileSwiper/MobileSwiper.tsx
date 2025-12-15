import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { useStyles } from '../../styles';

export type SwipeInput = { deltaX: number; deltaY: number };

type MobileSwiperProps = PropsWithChildren<{
  onSwipe: (_: SwipeInput) => void;
}>;

const MobileSwiper = ({ children, onSwipe }: MobileSwiperProps) => {
  const { styles } = useStyles();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleStart = useCallback((x: number, y: number) => {
    setStartX(x);
    setStartY(y);
    setIsSwiping(true);
  }, []);

  const handleEnd = useCallback(
    (endX: number, endY: number) => {
      if (!isSwiping) return;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      onSwipe({ deltaX, deltaY });

      setStartX(0);
      setStartY(0);
      setIsSwiping(false);
    },
    [isSwiping, startX, startY, onSwipe]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) return;
      e.preventDefault();

      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) return;
      e.preventDefault();

      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    },
    [handleEnd]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) return;
      e.preventDefault();

      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSwiping) return;
      e.preventDefault();

      handleEnd(e.clientX, e.clientY);
    },
    [isSwiping, handleEnd]
  );

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp]);

  return (
    <div ref={wrapperRef} className={styles.swiperContainer}>
      {children}
    </div>
  );
};

export default MobileSwiper;
