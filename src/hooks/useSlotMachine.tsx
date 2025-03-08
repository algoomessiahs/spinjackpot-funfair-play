
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  SymbolType, 
  ALL_SYMBOLS,
  generateSpinResult, 
  getVisibleSymbols,
  checkWinningLines,
  calculateJackpotContribution,
  checkJackpotWin,
  generateReelDelays
} from '@/utils/slotUtils';
import { toast } from 'sonner';

// Define the types for our hook
interface SlotMachineState {
  reels: SymbolType[][];
  spinning: boolean;
  reelPositions: number[];
  visibleSymbols: SymbolType[][];
  balance: number;
  betAmount: number;
  jackpotAmount: number;
  lastWin: number;
  autoPlay: boolean;
  autoPlayCount: number;
  soundEnabled: boolean;
  spinCount: number;
  winningLines: { line: number; symbol: SymbolType; count: number }[];
  spinInProgress: boolean[];
}

interface UseSlotMachineReturn extends SlotMachineState {
  spin: () => void;
  stopAutoPlay: () => void;
  toggleAutoPlay: () => void;
  toggleSound: () => void;
  setBetAmount: (amount: number) => void;
  resetGame: () => void;
  setJackpotAmount: (amount: number) => void; // New developer method
  setBalance: (amount: number) => void; // New developer method
  forceWin: () => void; // New developer method
  forceJackpot: () => void; // New developer method
  spinSound: HTMLAudioElement | null;
  winSound: HTMLAudioElement | null;
  jackpotSound: HTMLAudioElement | null;
}

// Set constants
const MIN_BET = 0.5;
const MAX_BET = 10;
const INITIAL_BALANCE = 100;
const INITIAL_JACKPOT = 50;
const HOUSE_EDGE = 0.05; // 5% house edge
const AUTO_PLAY_DELAY = 1500; // ms

export function useSlotMachine(): UseSlotMachineReturn {
  // Set up initial state
  const [state, setState] = useState<SlotMachineState>({
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
  });

  // Create refs for audio
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const jackpotSoundRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  
  // Flag to force a win on next spin (for development)
  const forceWinRef = useRef(false);
  const forceJackpotRef = useRef(false);

  // Initialize sounds
  useEffect(() => {
    spinSoundRef.current = new Audio('/sounds/spin.mp3');
    winSoundRef.current = new Audio('/sounds/win.mp3');
    jackpotSoundRef.current = new Audio('/sounds/jackpot.mp3');
    
    // Cleanup on unmount
    return () => {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  // Function to play sounds
  const playSound = useCallback((sound: HTMLAudioElement | null) => {
    if (sound && state.soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Could not play sound:", err));
    }
  }, [state.soundEnabled]);

  // Developer functions
  const setJackpotAmount = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      jackpotAmount: amount
    }));
  }, []);

  const setBalance = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      balance: amount
    }));
  }, []);

  const forceWin = useCallback(() => {
    forceWinRef.current = true;
    toast.info("Win will be forced on next spin", {
      duration: 3000,
    });
  }, []);

  const forceJackpot = useCallback(() => {
    forceJackpotRef.current = true;
    toast.info("Jackpot win will be forced on next spin", {
      duration: 3000,
    });
  }, []);

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
        Array(9).fill(jackpotSymbol) as SymbolType[],
        Array(9).fill(jackpotSymbol) as SymbolType[],
        Array(9).fill(jackpotSymbol) as SymbolType[]
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
              }, AUTO_PLAY_DELAY);
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
  }, [state, playSound]);

  // Function to toggle auto play
  const toggleAutoPlay = useCallback(() => {
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
  }, [spin]);

  // Function to stop auto play
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      window.clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      autoPlay: false,
      autoPlayCount: 0
    }));
  }, []);

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

  // Function to reset the game
  const resetGame = useCallback(() => {
    stopAutoPlay();
    
    setState({
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
    });
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
    forceWin,
    forceJackpot,
    spinSound: spinSoundRef.current,
    winSound: winSoundRef.current,
    jackpotSound: jackpotSoundRef.current
  };
}
