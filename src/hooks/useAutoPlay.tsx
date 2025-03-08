
import { useRef, useCallback, useEffect } from 'react';
import { MIN_BET, AUTO_PLAY_DELAY } from '@/types/slotMachineTypes';

export const useAutoPlay = (
  autoPlay: boolean, 
  spinning: boolean, 
  balance: number, 
  betAmount: number, 
  spin: () => void
) => {
  const autoPlayTimerRef = useRef<number | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  // Toggle auto play
  const toggleAutoPlay = useCallback(() => {
    return (setState: any) => {
      setState(prev => {
        // Clear any existing auto play timer
        if (autoPlayTimerRef.current) {
          window.clearTimeout(autoPlayTimerRef.current);
          autoPlayTimerRef.current = null;
        }
        
        const newAutoPlay = !prev.autoPlay;
        
        // If turning on auto play and not currently spinning, start spinning
        if (newAutoPlay && !prev.spinning && prev.balance >= prev.betAmount) {
          autoPlayTimerRef.current = window.setTimeout(() => {
            spin();
          }, 500);
        }
        
        return {
          ...prev,
          autoPlay: newAutoPlay,
          autoPlayCount: newAutoPlay ? Infinity : 0
        };
      });
    };
  }, [spin, spinning, balance, betAmount]);

  // Stop auto play
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      window.clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    
    return (setState: any) => {
      setState(prev => ({
        ...prev,
        autoPlay: false,
        autoPlayCount: 0
      }));
    };
  }, []);

  return {
    autoPlayTimerRef,
    toggleAutoPlay,
    stopAutoPlay
  };
};
