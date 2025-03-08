
import { useState, useCallback } from 'react';
import { 
  ALL_SYMBOLS, 
  generateSpinResult,
  getVisibleSymbols,
  checkWinningLines,
  calculateJackpotContribution,
  checkJackpotWin,
  generateReelDelays
} from '@/utils/slotUtils';
import { SlotMachineState, HOUSE_EDGE, INITIAL_JACKPOT } from '@/types/slotMachineTypes';
import { toast } from 'sonner';

export const useSpinLogic = (
  state: SlotMachineState,
  setState: React.Dispatch<React.SetStateAction<SlotMachineState>>,
  playSound: (sound: HTMLAudioElement | null) => void,
  spinSoundRef: React.RefObject<HTMLAudioElement | null>,
  winSoundRef: React.RefObject<HTMLAudioElement | null>,
  jackpotSoundRef: React.RefObject<HTMLAudioElement | null>,
  forceWinRef: React.MutableRefObject<boolean>,
  forceJackpotRef: React.MutableRefObject<boolean>,
  autoPlayTimerRef: React.MutableRefObject<number | null>
) => {
  // Function to handle a single spin
  const spin = useCallback(() => {
    // Don't allow spin if already spinning or not enough balance
    if (state.spinning || state.balance < state.betAmount) {
      if (state.balance < state.betAmount) {
        toast.error("Not enough balance to place bet");
      }
      return;
    }

    // Generate new reel results - with developer override if needed
    let newReels;
    if (forceWinRef.current) {
      // Create a winning combination (same symbol on middle row)
      const winningSymbol = 'bell'; // Medium payout symbol
      newReels = [
        [...ALL_SYMBOLS],
        [...ALL_SYMBOLS],
        [...ALL_SYMBOLS]
      ];
      // Ensure the middle position for each reel will show the winning symbol
      newReels[0][1] = winningSymbol;
      newReels[1][1] = winningSymbol;
      newReels[2][1] = winningSymbol;
      forceWinRef.current = false; // Reset the flag
    } else if (forceJackpotRef.current) {
      // Create a full jackpot winning combination (all same symbols)
      const jackpotSymbol = 'seven'; // Highest payout symbol
      newReels = [
        Array(9).fill(jackpotSymbol) as any,
        Array(9).fill(jackpotSymbol) as any,
        Array(9).fill(jackpotSymbol) as any
      ];
      forceJackpotRef.current = false; // Reset the flag
    } else {
      // Normal random result
      newReels = generateSpinResult();
    }

    const delays = generateReelDelays();
    
    // Play spin sound
    playSound(spinSoundRef.current);
    
    // Update state to start spinning
    setState(prev => ({
      ...prev,
      spinning: true,
      reels: newReels,
      balance: prev.balance - prev.betAmount,
      jackpotAmount: prev.jackpotAmount + calculateJackpotContribution(prev.betAmount),
      lastWin: 0,
      winningLines: [],
      spinCount: prev.spinCount + 1,
      spinInProgress: [true, true, true]
    }));

    // Stop each reel after its delay
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setState(prev => {
          // Update the reel position for this specific reel
          const newReelPositions = [...prev.reelPositions];
          newReelPositions[index] = Math.floor(Math.random() * prev.reels[index].length);
          
          // Mark this reel as stopped
          const newSpinInProgress = [...prev.spinInProgress];
          newSpinInProgress[index] = false;
          
          // Calculate visible symbols for all reels
          const newVisibleSymbols = getVisibleSymbols(prev.reels, newReelPositions);
          
          // Check if all reels have stopped
          const allStopped = newSpinInProgress.every(spinning => !spinning);
          
          // If all reels stopped, check for wins
          let newLastWin = prev.lastWin;
          let newBalance = prev.balance;
          let newJackpotAmount = prev.jackpotAmount;
          let newWinningLines = prev.winningLines;
          
          if (allStopped) {
            // Check for wins
            const { wins, totalWin, multiplier } = checkWinningLines(newVisibleSymbols);
            
            // Calculate actual win (accounting for house edge)
            const actualWin = totalWin * prev.betAmount * (1 - HOUSE_EDGE);
            
            newLastWin = actualWin;
            newBalance += actualWin;
            newWinningLines = wins;
            
            // Check for jackpot win - developer override if forcing jackpot
            const jackpotWon = forceJackpotRef.current === true || checkJackpotWin(prev.jackpotAmount);
            
            if (jackpotWon) {
              playSound(jackpotSoundRef.current);
              newLastWin += prev.jackpotAmount;
              newBalance += prev.jackpotAmount;
              newJackpotAmount = INITIAL_JACKPOT;
              
              toast.success(`JACKPOT! You won ${prev.jackpotAmount.toFixed(2)}!`, {
                duration: 5000,
              });
            } else if (actualWin > 0) {
              // Play win sound if any win
              playSound(winSoundRef.current);
              
              if (wins.length > 0) {
                toast.success(`You won ${actualWin.toFixed(2)}!`);
              }
            }
            
            // If auto play is active, schedule next spin
            if (prev.autoPlay && prev.balance >= prev.betAmount) {
              autoPlayTimerRef.current = window.setTimeout(() => {
                spin();
              }, 1500);
            }
          }
          
          return {
            ...prev,
            spinning: !allStopped,
            reelPositions: newReelPositions,
            visibleSymbols: newVisibleSymbols,
            spinInProgress: newSpinInProgress,
            balance: newBalance,
            jackpotAmount: newJackpotAmount,
            lastWin: newLastWin,
            winningLines: newWinningLines
          };
        });
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

  return {
    spin
  };
};
