
import { SymbolType } from "@/utils/slotUtils";

// Constants
export const MIN_BET = 1;
export const MAX_BET = 10;
export const INITIAL_BALANCE = 100;
export const INITIAL_JACKPOT = 50;

// Main state interface
export interface SlotMachineState {
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

// Return type for the useSlotMachine hook
export interface UseSlotMachineReturn extends SlotMachineState {
  spin: () => void;
  stopAutoPlay: () => void;
  toggleAutoPlay: () => void;
  toggleSound: () => void;
  setBetAmount: (amount: number) => void;
  setMaxBet: () => void;
  setMinBet: () => void;
  resetGame: () => void;
  setJackpotAmount: (amount: number) => void;
  setBalance: (amount: number) => void;
  forceWin: () => void;
  forceJackpot: () => void;
  spinSound: HTMLAudioElement | null;
  winSound: HTMLAudioElement | null;
  jackpotSound: HTMLAudioElement | null;
}
