
import React, { useState } from 'react';
import { useSlotMachine } from '@/hooks/useSlotMachine';
import SlotReel from './SlotReel';
import BetControls from './BetControls';
import JackpotDisplay from './JackpotDisplay';
import InfoModal from './InfoModal';
import PayTable from './PayTable';
import DevTools from './DevTools';
import { Button } from '@/components/ui/button';
import { Info, Menu } from 'lucide-react';

const SlotMachine: React.FC = () => {
  const {
    reels,
    spinning,
    reelPositions,
    balance,
    betAmount,
    jackpotAmount,
    lastWin,
    autoPlay,
    soundEnabled,
    winningLines,
    spin,
    stopAutoPlay,
    toggleAutoPlay,
    toggleSound,
    setBetAmount,
    resetGame,
    setJackpotAmount,
    setBalance,
    forceWin,
    forceJackpot
  } = useSlotMachine();

  const [infoOpen, setInfoOpen] = useState(false);
  const [payTableOpen, setPayTableOpen] = useState(false);

  const generateReelDelays = () => {
    return [
      800 + Math.random() * 300,
      1100 + Math.random() * 300,
      1400 + Math.random() * 300
    ];
  };

  const reelDelays = generateReelDelays();

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center">
        {/* Top Bar with Balance and Menu */}
        <div className="w-full flex justify-between items-center mb-4">
          <div className="glass-morphism px-4 py-2 rounded-lg">
            <span className="text-sm opacity-80">Balance</span>
            <div className="text-xl font-bold">{balance.toFixed(2)}</div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPayTableOpen(true)}
              className="glass-morphism"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setInfoOpen(true)}
              className="glass-morphism"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Jackpot Display */}
        <JackpotDisplay amount={jackpotAmount} lastWin={lastWin} />
        
        {/* Slot Machine */}
        <div className="slot-machine w-full aspect-[4/3] max-w-[640px] flex flex-col bg-gradient-to-b from-slot-machine to-black rounded-xl overflow-hidden shadow-2xl border border-white/5">
          {/* Winning Lines Overlay */}
          <div className="relative w-full h-full flex justify-center items-center">
            {/* Slot Reels Container */}
            <div className="flex justify-between w-full h-[360px] gap-1 p-4">
              {reels.map((reelSymbols, index) => (
                <SlotReel
                  key={index}
                  symbols={reelSymbols}
                  spinning={spinning}
                  position={reelPositions[index]}
                  delay={reelDelays[index]}
                  winning={winningLines.some(line => 
                    line.line === 0 || line.line === 1 || line.line === 2
                  )}
                />
              ))}
            </div>
            
            {/* Win Lines Overlay */}
            {winningLines.map((win, index) => (
              <div
                key={index}
                className={`win-line ${!spinning ? 'active' : ''}`}
                style={{
                  top: `${120 * win.line + 60 + 16}px`, // Align with the middle of the row + padding
                  left: '20px',
                  right: '20px',
                  height: '0',
                  borderColor: 'rgba(255, 215, 0, 0.8)'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <BetControls
          balance={balance}
          betAmount={betAmount}
          spinning={spinning}
          autoPlay={autoPlay}
          soundEnabled={soundEnabled}
          onBetChange={setBetAmount}
          onSpin={spin}
          onAutoPlayToggle={autoPlay ? stopAutoPlay : toggleAutoPlay}
          onSoundToggle={toggleSound}
          onReset={resetGame}
        />
      </div>
      
      {/* Modals */}
      <InfoModal 
        open={infoOpen} 
        onOpenChange={setInfoOpen} 
        onShowPayTable={() => setPayTableOpen(true)} 
      />
      
      <PayTable 
        open={payTableOpen} 
        onOpenChange={setPayTableOpen} 
      />
      
      {/* Developer Tools (only visible in development) */}
      <DevTools
        jackpotAmount={jackpotAmount}
        balance={balance}
        onSetJackpot={setJackpotAmount}
        onSetBalance={setBalance}
        onForceWin={forceWin}
        onForceJackpot={forceJackpot}
      />
    </div>
  );
};

export default SlotMachine;
