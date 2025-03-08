
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, PlayCircle, PauseCircle, RefreshCw, Plus, Minus, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { MIN_BET, MAX_BET } from '@/types/slotMachineTypes';

interface BetControlsProps {
  balance: number;
  betAmount: number;
  spinning: boolean;
  autoPlay: boolean;
  soundEnabled: boolean;
  onBetChange: (amount: number) => void;
  onSpin: () => void;
  onAutoPlayToggle: () => void;
  onSoundToggle: () => void;
  onReset: () => void;
  onMinBet?: () => void;
  onMaxBet?: () => void;
}

const BetControls: React.FC<BetControlsProps> = ({
  balance,
  betAmount,
  spinning,
  autoPlay,
  soundEnabled,
  onBetChange,
  onSpin,
  onAutoPlayToggle,
  onSoundToggle,
  onReset,
  onMinBet,
  onMaxBet
}) => {
  const increaseBet = () => {
    const newBet = Math.min(betAmount + 1, MAX_BET);
    onBetChange(newBet);
  };

  const decreaseBet = () => {
    const newBet = Math.max(betAmount - 1, MIN_BET);
    onBetChange(newBet);
  };

  return (
    <div className="w-full max-w-[640px] mt-4 flex flex-col gap-4">
      {/* Bet Amount Controls */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMinBet} 
            disabled={spinning || betAmount === MIN_BET}
            className="h-8 w-8 hover:bg-white/10"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={decreaseBet} 
            disabled={spinning || betAmount <= MIN_BET}
            className="h-8 w-8 hover:bg-white/10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="px-2 py-1 bg-white/5 rounded-md">
            <span className="text-sm font-medium">Bet: {betAmount.toFixed(2)}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={increaseBet} 
            disabled={spinning || betAmount >= MAX_BET}
            className="h-8 w-8 hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMaxBet} 
            disabled={spinning || betAmount === MAX_BET}
            className="h-8 w-8 hover:bg-white/10"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onSoundToggle}
            className="h-9 w-9 bg-white/5 hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-9 w-9 bg-white/5 hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onAutoPlayToggle}
            className={`h-9 w-9 ${autoPlay ? 'bg-primary/20' : 'bg-white/5'} hover:bg-white/10`}
          >
            {autoPlay ? (
              <PauseCircle className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Spin Button */}
      <Button
        size="lg"
        disabled={spinning || balance < betAmount}
        onClick={onSpin}
        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl shadow-lg transition-colors"
      >
        {spinning ? (
          <RefreshCw className="h-6 w-6 animate-spin" />
        ) : (
          "SPIN"
        )}
      </Button>
    </div>
  );
};

export default BetControls;
