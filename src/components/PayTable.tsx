
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { PAYOUT_TABLE, SymbolType, SYMBOL_IMAGES } from '@/utils/slotUtils';

interface PayTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayTable: React.FC<PayTableProps> = ({ open, onOpenChange }) => {
  // Sort symbols by payout (highest first)
  const sortedSymbols = Object.entries(PAYOUT_TABLE)
    .sort(([, a], [, b]) => b - a)
    .map(([symbol]) => symbol as SymbolType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Pay Table</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground mb-4">
            <p>Match 3 symbols in a row to win. The payout depends on the symbol value.</p>
            <p className="mt-2">5% of every bet is added to the Jackpot. When the Jackpot reaches 100, someone will win it!</p>
          </div>
          
          <div className="space-y-2">
            {sortedSymbols.map((symbol) => (
              <div key={symbol} className="pay-table-row">
                <div className="pay-table-symbols">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src={SYMBOL_IMAGES[symbol]} 
                      alt={symbol} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src={SYMBOL_IMAGES[symbol]} 
                      alt={symbol} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src={SYMBOL_IMAGES[symbol]} 
                      alt={symbol} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="pay-table-payout">
                  {PAYOUT_TABLE[symbol]}x
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-secondary/30 rounded-lg">
            <h3 className="font-bold mb-2">Special Jackpot:</h3>
            <p className="text-sm text-muted-foreground">
              Get all 9 symbols the same for a special jackpot bonus! (3x multiplier)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayTable;
