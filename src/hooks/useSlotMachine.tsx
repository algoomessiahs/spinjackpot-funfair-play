
import { useState, useCallback } from 'react';
import { 
  ALL_SYMBOLS,
  SymbolType
} from '@/utils/slotUtils';
import { toast } from 'sonner';
import { 
  SlotMachineState, 
  UseSlotMachineReturn,
  MIN_BET,
  MAX_BET,
  INITIAL_BALANCE,
  INITIAL_JACKPOT
} from '@/types/slotMachineTypes';
import { useDevTools } from './useDevTools';
import { useSoundEffects } from './useSoundEffects';
import { useAutoPlay } from './useAutoPlay';
import { useSpinLogic } from './useSpinLogic';

// Initial state for the slot machine
const initialState: SlotMachineState = {
  reels: [
    ALL_SYMBOLS,
    ALL_SYMBOLS,
    ALL_SYMBOLS
  ],
  spinning: false,
  reelPositions: [0, 0, 0],
  visibleSymbols: [
    [ALL_SYMBOLS[0], ALL_SYMBOLS[1], ALL_SYMBOLS[2]],
    [ALL_SYMBOLS[0], ALL_SYMBOLS[1], ALL_SYMBOLS[2]],
    [ALL_SYMBOLS[0], ALL_SYMBOLS[1], ALL_SYMBOLS[2]]
  ],
  balance: INITIAL_BALANCE,
  betAmount: MIN_BET,
  jackpotAmount: INITIAL_JACKPOT,
  lastWin: 0,
  autoPlay: false,
  autoPlayCount: 0,
  soundEnabled: true,
  spinCount: 0,
  winningLines: [],
  spinInProgress: [false, false, false]
};

export function useSlotMachine(): UseSlotMachineReturn {
  // Set up state
  const [state, setState] = useState<SlotMachineState>(initialState);
  
  // Initialize dev tools
  const { 
    forceWinRef, 
    forceJackpotRef, 
    setJackpotAmount: devSetJackpot, 
    setBalance: devSetBalance, 
    forceWin: devForceWin, 
    forceJackpot: devForceJackpot 
  } = useDevTools();
  
  // Initialize sound effects
  const { spinSoundRef, winSoundRef, jackpotSoundRef, playSound } = useSoundEffects(state.soundEnabled);
  
  // Set up auto play (needs spin reference which we'll define later)
  const autoPlayHandler = useAutoPlay(
    state.autoPlay, 
    state.spinning, 
    state.balance, 
    state.betAmount,
    () => {} // Placeholder, will be updated after spin function is created
  );
  const { autoPlayTimerRef, toggleAutoPlay: toggleAutoPlayBase, stopAutoPlay: stopAutoPlayBase } = autoPlayHandler;
  
  // Set up spin logic (needs spin reference too)
  const spinLogicHandler = useSpinLogic(
    state,
    setState,
    playSound,
    spinSoundRef,
    winSoundRef,
    jackpotSoundRef,
    forceWinRef,
    forceJackpotRef,
    autoPlayTimerRef
  );
  const { spin } = spinLogicHandler;
  
  // Connect spin function to autoPlay
  // This is a bit of a hack since there's a circular dependency
  (autoPlayHandler as any).spin = spin;
  
  // Function to toggle sound
  const toggleSound = useCallback(() => {
    setState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  }, []);

  // Function to set bet amount
  const setBetAmount = useCallback((amount: number) => {
    // Ensure amount is within min/max range
    const newAmount = Math.max(MIN_BET, Math.min(MAX_BET, amount));
    
    setState(prev => ({
      ...prev,
      betAmount: newAmount
    }));
  }, []);

  // Wrapper functions
  const toggleAutoPlay = useCallback(() => {
    toggleAutoPlayBase(setState);
  }, [toggleAutoPlayBase]);
  
  const stopAutoPlay = useCallback(() => {
    stopAutoPlayBase(setState);
  }, [stopAutoPlayBase]);
  
  const setJackpotAmount = useCallback((amount: number) => {
    devSetJackpot(amount, setState);
  }, [devSetJackpot]);
  
  const setBalance = useCallback((amount: number) => {
    devSetBalance(amount, setState);
  }, [devSetBalance]);
  
  // Function to reset the game
  const resetGame = useCallback(() => {
    stopAutoPlay();
    setState(initialState);
  }, [stopAutoPlay]);

  return {
    ...state,
    spin,
    stopAutoPlay,
    toggleAutoPlay,
    toggleSound,
    setBetAmount,
    resetGame,
    setJackpotAmount,
    setBalance,
    forceWin: devForceWin,
    forceJackpot: devForceJackpot,
    spinSound: spinSoundRef.current,
    winSound: winSoundRef.current,
    jackpotSound: jackpotSoundRef.current
  };
}
