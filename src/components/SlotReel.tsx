
import React, { useRef, useEffect } from 'react';
import { SymbolType, SYMBOL_IMAGES } from '@/utils/slotUtils';

interface SlotReelProps {
  symbols: SymbolType[];
  spinning: boolean;
  position: number;
  delay: number;
  winning?: boolean;
}

const SlotReel: React.FC<SlotReelProps> = ({ 
  symbols, 
  spinning, 
  position, 
  delay,
  winning = false
}) => {
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reelRef.current) return;
    
    if (spinning) {
      // Set the spin animation
      reelRef.current.style.setProperty('--spin-duration', `${delay}ms`);
      reelRef.current.classList.add('spin-animation');
      reelRef.current.classList.remove('slot-stop');
      
      // Reset the transform after the spin is complete
      const timer = setTimeout(() => {
        if (reelRef.current) {
          reelRef.current.classList.remove('spin-animation');
          reelRef.current.style.transform = `translateY(calc(-100% * 10 + ${-(position * 120)}px))`;
          reelRef.current.classList.add('slot-stop');
          reelRef.current.style.setProperty('--offset', `${-(position * 120)}px`);
        }
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Set the position when not spinning
      reelRef.current.classList.remove('spin-animation');
      reelRef.current.style.transform = `translateY(calc(-100% * ${position}))`;
    }
  }, [spinning, position, delay]);

  return (
    <div className="slot-reel w-1/3 h-[360px] bg-slot-machine rounded-lg overflow-hidden relative">
      <div 
        ref={reelRef}
        className={`flex flex-col transition-transform ${winning ? 'win-animation' : ''}`}
        style={{ 
          transform: spinning ? 'translateY(0)' : `translateY(calc(-100% * ${position}))`
        }}
      >
        {/* Create multiple copies of the symbols to simulate an infinite loop */}
        {[...Array(20)].map((_, i) => (
          symbols.map((symbol, j) => (
            <div 
              key={`${i}-${j}`}
              className={`slot-symbol h-[120px] flex items-center justify-center p-2 border-b border-white/10`}
            >
              <img 
                src={SYMBOL_IMAGES[symbol]} 
                alt={symbol} 
                className="max-h-full max-w-full object-contain"
                style={{ 
                  filter: winning ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))' : 'none'
                }}
              />
            </div>
          ))
        ))}
      </div>
      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SlotReel;
