
import { useCallback, MutableRefObject } from 'react';
import { SlotMachineState } from '@/types/slotMachineTypes';
import { 
  generateSpinResult, 
  getVisibleSymbols,
  checkWinningLines,
  calculateJackpotContribution,
  checkJackpotWin
} from '@/utils/slotUtils';
import { toast } from 'sonner';

export const useSpinLogic = (
  state: SlotMachineState,
  setState: React.Dispatch<React.SetStateAction<SlotMachineState>>,
  playSound: (sound: HTMLAudioElement | null) => void,
  spinSoundRef: MutableRefObject<HTMLAudioElement | null>,
  winSoundRef: MutableRefObject<HTMLAudioElement | null>,
  jackpotSoundRef: MutableRefObject<HTMLAudioElement | null>,
  forceWinRef: MutableRefObject<boolean>,
  forceJackpotRef: MutableRefObject<boolean>,
  autoPlayTimerRef: MutableRefObject<number | null> | null
) => {
  // The actual spin function
  const spin = useCallback(() => {
    // Don't allow spin if already spinning or if balance < bet amount
    if (state.spinning || state.balance < state.betAmount) {
      if (state.balance < state.betAmount) {
        toast.error("Insufficient balance for this bet", { duration: 2000 });
      }
      return;
    }

    // Deduct bet amount from balance
    setState(prev => ({
      ...prev,
      balance: prev.balance - prev.betAmount,
      spinning: true,
      winningLines: [],
      spinCount: prev.spinCount + 1,
      lastWin: 0
    }));

    // Play spin sound
    playSound(spinSoundRef.current);

    // Add to jackpot (5% of bet)
    const jackpotContribution = calculateJackpotContribution(state.betAmount);
    setState(prev => ({
      ...prev,
      jackpotAmount: prev.jackpotAmount + jackpotContribution
    }));

    // Generate random spin result
    let newReels = generateSpinResult();

    // If forcing a win for testing
    if (forceWinRef.current) {
      // Create a winning pattern (e.g., matching symbols on middle row)
      const symbol = 'bell';
      newReels = [
        [...newReels[0]],
        [...newReels[1]],
        [...newReels[2]]
      ];
      
      newReels[0][1] = symbol;
      newReels[1][1] = symbol;
      newReels[2][1] = symbol;
      
      forceWinRef.current = false;
    }

    // If forcing a jackpot win for testing
    if (forceJackpotRef.current) {
      // Create a jackpot pattern (all 9 positions have same symbol)
      const symbol = 'seven';
      newReels = [
        [symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol],
        [symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol],
        [symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol, symbol]
      ];
      
      forceJackpotRef.current = false;
    }

    // Set initial reels with new positions
    setState(prev => {
      const newPositions = [0, 0, 0];
      return {
        ...prev,
        reels: newReels,
        reelPositions: newPositions,
        visibleSymbols: getVisibleSymbols(newReels, newPositions)
      };
    });

    // Set timers for each reel to stop spinning
    const reelDelays = [900, 1200, 1500];
    
    // Mark each reel as spinning
    setState(prev => ({
      ...prev,
      spinInProgress: [true, true, true]
    }));

    // Schedule stopping each reel
    reelDelays.forEach((delay, index) => {
      setTimeout(() => {
        // Stop this reel
        setState(prev => {
          const newSpinInProgress = [...prev.spinInProgress];
          newSpinInProgress[index] = false;
          
          return {
            ...prev,
            spinInProgress: newSpinInProgress
          };
        });
        
        // If this is the last reel, check for wins
        if (index === reelDelays.length - 1) {
          setTimeout(() => {
            // Stop all spinning
            setState(prev => {
              const visibleSymbols = getVisibleSymbols(prev.reels, prev.reelPositions);
              const { wins, totalWin, multiplier } = checkWinningLines(visibleSymbols);
              
              // Check for jackpot win (separate from regular win lines)
              let jackpotWin = false;
              let jackpotAmount = 0;
              
              if (checkJackpotWin(prev.jackpotAmount) || forceJackpotRef.current) {
                jackpotWin = true;
                jackpotAmount = prev.jackpotAmount;
                playSound(jackpotSoundRef.current);
                
                toast.success(`JACKPOT WIN! ${jackpotAmount.toFixed(2)}`, {
                  duration: 5000
                });
              }
              
              // Calculate total payout including possible jackpot
              const totalPayout = totalWin * prev.betAmount + jackpotAmount;
              
              // If player won something
              if (totalPayout > 0) {
                // Play win sound if not a jackpot (jackpot has its own sound)
                if (!jackpotWin) {
                  playSound(winSoundRef.current);
                  
                  if (totalWin > 10) {
                    toast.success(`Big Win! ${totalPayout.toFixed(2)}`, {
                      duration: 3000
                    });
                  }
                }
              }
              
              return {
                ...prev,
                spinning: false,
                balance: prev.balance + totalPayout,
                lastWin: totalPayout,
                winningLines: wins,
                jackpotAmount: jackpotWin ? 0 : prev.jackpotAmount
              };
            });
            
            // Schedule next spin if auto play is enabled
            setState(prev => {
              if (prev.autoPlay && prev.balance >= prev.betAmount) {
                if (autoPlayTimerRef) {
                  autoPlayTimerRef.current = window.setTimeout(() => {
                    spin();
                  }, 1000);
                }
              }
              return prev;
            });
          }, 500);
        }
      }, delay);
    });
  }, [
    state, 
    setState, 
    playSound, 
    spinSoundRef, 
    winSoundRef, 
    jackpotSoundRef, 
    forceWinRef, 
    forceJackpotRef, 
    autoPlayTimerRef
  ]);

  return { spin };
};
