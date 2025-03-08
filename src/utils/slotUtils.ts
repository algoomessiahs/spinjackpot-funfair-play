
// Symbol types
export type SymbolType = 
  | 'seven' 
  | 'banana' 
  | 'melon' 
  | 'lemon' 
  | 'bar' 
  | 'bell' 
  | 'orange' 
  | 'plum' 
  | 'cherry';

// Define the payout rates for each symbol combination
export const PAYOUT_TABLE: Record<SymbolType, number> = {
  seven: 50,    // Highest payout
  bar: 20,
  bell: 15,
  melon: 10,
  banana: 8,
  orange: 6,
  plum: 5,
  lemon: 4,
  cherry: 3     // Lowest payout
};

// Define the probability weights for each symbol
export const SYMBOL_WEIGHTS: Record<SymbolType, number> = {
  seven: 1,     // Least frequent
  bar: 2,
  bell: 3,
  melon: 4,
  banana: 5,
  orange: 6,
  plum: 7,
  lemon: 8,
  cherry: 9     // Most frequent
};

// All available symbols
export const ALL_SYMBOLS: SymbolType[] = [
  'seven', 'banana', 'melon', 'lemon', 'bar', 'bell', 'orange', 'plum', 'cherry'
];

// Symbol paths
export const SYMBOL_IMAGES: Record<SymbolType, string> = {
  seven: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  banana: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  melon: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  lemon: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  bar: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  bell: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  orange: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  plum: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png",
  cherry: "/lovable-uploads/c5c7a226-2be6-4284-a1c6-b4a693db5e58.png"
};

// Generate a single reel based on weights
export const generateWeightedReel = (): SymbolType[] => {
  // Create a weighted array where each symbol appears according to its weight
  const weightedPool: SymbolType[] = [];
  
  Object.entries(SYMBOL_WEIGHTS).forEach(([symbol, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedPool.push(symbol as SymbolType);
    }
  });
  
  // Shuffle the weighted pool
  const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
  
  // Pick the first 9 symbols for the reel
  return shuffled.slice(0, 9);
};

// Generate all 3 reel results
export const generateSpinResult = (): SymbolType[][] => {
  return [
    generateWeightedReel(),
    generateWeightedReel(),
    generateWeightedReel()
  ];
};

// Get the 3x3 matrix of visible symbols
export const getVisibleSymbols = (reels: SymbolType[][], positions: number[]): SymbolType[][] => {
  return reels.map((reel, i) => {
    const pos = positions[i];
    return [
      reel[(pos) % reel.length],
      reel[(pos + 1) % reel.length],
      reel[(pos + 2) % reel.length]
    ];
  });
};

// Check for winning combinations
export const checkWinningLines = (visibleSymbols: SymbolType[][]): {
  wins: { line: number; symbol: SymbolType; count: number }[];
  totalWin: number;
  multiplier: number;
} => {
  const wins: { line: number; symbol: SymbolType; count: number }[] = [];
  let multiplier = 1;

  // Check horizontal lines (3 lines)
  for (let row = 0; row < 3; row++) {
    const symbols = [
      visibleSymbols[0][row],
      visibleSymbols[1][row],
      visibleSymbols[2][row]
    ];
    
    const firstSymbol = symbols[0];
    const allMatch = symbols.every(s => s === firstSymbol);
    
    if (allMatch) {
      wins.push({ line: row, symbol: firstSymbol, count: 3 });
      multiplier += 0.2; // Increase multiplier for each winning line
    }
  }

  // Check for jackpot (all 9 symbols are the same)
  const allSymbols = visibleSymbols.flat();
  const jackpotSymbol = allSymbols[0];
  const isJackpot = allSymbols.every(s => s === jackpotSymbol);
  
  if (isJackpot) {
    multiplier = 3; // Triple the win for a jackpot
  }

  // Calculate total win
  let totalWin = 0;
  wins.forEach(win => {
    totalWin += PAYOUT_TABLE[win.symbol] * win.count;
  });
  
  totalWin *= multiplier;

  return { wins, totalWin, multiplier };
};

// Calculate the jackpot contribution (5% of bet)
export const calculateJackpotContribution = (betAmount: number): number => {
  return betAmount * 0.05;
};

// Check if player wins the jackpot
export const checkJackpotWin = (jackpotAmount: number): boolean => {
  // Logic: If jackpot is over 100, there's a small chance to win
  if (jackpotAmount >= 100) {
    // Random chance based on jackpot amount
    // The higher the jackpot, the higher the chance to win
    const chance = (jackpotAmount - 100) / 1000 + 0.01; // 1% base chance + additional based on amount
    return Math.random() < chance;
  }
  return false;
};

// Generate a random spin delay for each reel
export const generateReelDelays = (): number[] => {
  return [
    500 + Math.random() * 300,
    800 + Math.random() * 400,
    1100 + Math.random() * 500
  ];
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};
