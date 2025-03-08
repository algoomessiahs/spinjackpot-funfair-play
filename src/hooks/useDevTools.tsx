
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

export const useDevTools = () => {
  // Flag refs for developer testing
  const forceWinRef = useRef(false);
  const forceJackpotRef = useRef(false);

  // Set jackpot amount (developer function)
  const setJackpotAmount = useCallback((amount: number, setState: any) => {
    setState(prev => ({
      ...prev,
      jackpotAmount: amount
    }));
  }, []);

  // Set balance amount (developer function)
  const setBalance = useCallback((amount: number, setState: any) => {
    setState(prev => ({
      ...prev,
      balance: amount
    }));
  }, []);

  // Force a win on next spin (developer function)
  const forceWin = useCallback(() => {
    forceWinRef.current = true;
    toast.info("Win will be forced on next spin", {
      duration: 3000,
    });
  }, []);

  // Force a jackpot win on next spin (developer function)
  const forceJackpot = useCallback(() => {
    forceJackpotRef.current = true;
    toast.info("Jackpot win will be forced on next spin", {
      duration: 3000,
    });
  }, []);

  return {
    forceWinRef,
    forceJackpotRef,
    setJackpotAmount,
    setBalance,
    forceWin,
    forceJackpot
  };
};
