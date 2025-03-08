
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface DevToolsProps {
  jackpotAmount: number;
  balance: number;
  onSetJackpot: (amount: number) => void;
  onSetBalance: (amount: number) => void;
  onForceWin: () => void;
  onForceJackpot: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({
  jackpotAmount,
  balance,
  onSetJackpot,
  onSetBalance,
  onForceWin,
  onForceJackpot
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Dev Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-black/90 border border-red-500 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-red-500 font-bold">Developer Testing Tools</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-red-500 hover:text-white hover:bg-red-500/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="jackpot-amount">Jackpot Amount:</Label>
            <span className="text-white">{jackpotAmount.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Slider 
              id="jackpot-amount"
              defaultValue={[jackpotAmount]}
              max={1000}
              step={10}
              onValueChange={(value) => onSetJackpot(value[0])}
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onSetJackpot(100)}
              className="text-xs"
            >
              Set 100
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="balance-amount">Player Balance:</Label>
            <span className="text-white">{balance.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Input 
              id="balance-amount"
              type="number" 
              value={balance}
              onChange={(e) => onSetBalance(Number(e.target.value))}
              className="w-full bg-black/50 text-white"
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onSetBalance(1000)}
              className="whitespace-nowrap text-xs"
            >
              Set 1000
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-xs"
            onClick={onForceWin}
          >
            Force Win
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
            onClick={onForceJackpot}
          >
            Force Jackpot
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          These tools are only visible in development mode.
        </div>
      </div>
    </div>
  );
};

export default DevTools;
