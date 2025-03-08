
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PAYOUT_TABLE, SymbolType, SYMBOL_IMAGES } from '@/utils/slotUtils';

interface InfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowPayTable: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ 
  open, 
  onOpenChange,
  onShowPayTable
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Game Information</DialogTitle>
          <DialogDescription className="text-center">
            Learn how to play and win
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="how-to-play">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="how-to-play">How to Play</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px] mt-4 pr-4">
            <TabsContent value="how-to-play" className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Getting Started</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Set your bet amount using the slider or +/- buttons</li>
                  <li>Click SPIN to start the game</li>
                  <li>Match 3 symbols in a row to win</li>
                  <li>Different symbols have different payouts</li>
                  <li>5% of your bet goes to the Jackpot</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Winning</h3>
                <p className="text-sm">
                  You win when you get 3 matching symbols in a horizontal row. 
                  The payout depends on the symbol type.
                </p>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      setTimeout(onShowPayTable, 100);
                    }}
                  >
                    View Pay Table
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Jackpot</h3>
                <p className="text-sm">
                  5% of every bet is added to the jackpot. When the jackpot amount 
                  reaches 100, there's a chance to win the entire jackpot! 
                  The bigger the jackpot gets, the higher the chance to win it.
                </p>
                <p className="text-sm mt-2">
                  There's also a special jackpot if you get all 9 symbols the same!
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Auto Play</h3>
                <p className="text-sm">
                  Use the Auto Play feature to automatically spin the reels 
                  without having to click the spin button each time. 
                  You can stop Auto Play at any time.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Game Details</h3>
                <p className="text-sm">
                  This is a classic 3x3 slot machine game with traditional fruit symbols.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>House Edge: 5%</li>
                  <li>Jackpot Contribution: 5% of each bet</li>
                  <li>Minimum Bet: 0.5</li>
                  <li>Maximum Bet: 10</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Symbols</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(PAYOUT_TABLE).map((symbol) => (
                    <div key={symbol} className="flex flex-col items-center p-2">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img 
                          src={SYMBOL_IMAGES[symbol as SymbolType]} 
                          alt={symbol} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-xs mt-1 capitalize">{symbol}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Credits</h3>
                <p className="text-sm">
                  Created with ❤️ for Pi Network Testnet.
                </p>
                <p className="text-xs mt-2 text-muted-foreground">
                  Version 1.0.0
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
