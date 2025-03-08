
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Minus, 
  Plus, 
  Play, 
  Square, 
  RefreshCw,
  Volume2, 
  VolumeX
} from 'lucide-react';

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
  onReset
}) => {
  const MIN_BET = 0.5;
  const MAX_BET = 10;
  const STEP = 0.5;

  const handleIncreaseBet = () => {
    const newBet = Math.min(betAmount + STEP, MAX_BET);
    onBetChange(newBet);
  };

  const handleDecreaseBet = () => {
    const newBet = Math.max(betAmount - STEP, MIN_BET);
    onBetChange(newBet);
  };

  const handleSliderChange = (value: number[]) => {
    onBetChange(value[0]);
  };

  return (
    <div className="slot-controls w-full mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bet Amount:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecreaseBet}
                disabled={betAmount <= MIN_BET || spinning}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold text-gradient-gold min-w-[60px]">
                {betAmount.toFixed(2)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleIncreaseBet}
                disabled={betAmount >= MAX_BET || spinning}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Slider
            value={[betAmount]}
            min={MIN_BET}
            max={MAX_BET}
            step={STEP}
            onValueChange={handleSliderChange}
            disabled={spinning}
            className="my-2"
          />
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onSoundToggle}
            className="glass-morphism"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="glass-morphism"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Button
            variant={autoPlay ? "destructive" : "outline"}
            onClick={onAutoPlayToggle}
            disabled={spinning && !autoPlay}
            className={`glass-morphism ${autoPlay ? 'bg-red-500/20' : ''}`}
          >
            {autoPlay ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Auto
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto Play
              </>
            )}
          </Button>
          
          <Button
            variant="default"
            onClick={onSpin}
            disabled={spinning || balance < betAmount}
            className="button-glow bg-slot-gold text-black font-bold px-8 min-w-[120px]"
            style={{
              background: 'linear-gradient(135deg, #FFCA28 0%, #FFD700 50%, #FFC107 100%)'
            }}
          >
            SPIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BetControls;
