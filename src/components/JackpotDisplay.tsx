
import React, { useEffect, useRef, useState } from 'react';

interface JackpotDisplayProps {
  amount: number;
  lastWin: number;
}

const JackpotDisplay: React.FC<JackpotDisplayProps> = ({ amount, lastWin }) => {
  const [displayedAmount, setDisplayedAmount] = useState(amount);
  const prevAmountRef = useRef(amount);
  const animationRef = useRef<number | null>(null);
  
  // Animated counter effect
  useEffect(() => {
    if (prevAmountRef.current !== amount) {
      // Cancel any existing animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const startAmount = prevAmountRef.current;
      const difference = amount - startAmount;
      const duration = 1000; // 1 second
      const startTime = performance.now();
      
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = (t: number) => t * (2 - t);
        
        // Calculate current display value
        const currentValue = startAmount + difference * easeOutQuad(progress);
        setDisplayedAmount(currentValue);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          // Ensure we end exactly at the target amount
          setDisplayedAmount(amount);
        }
      };
      
      animationRef.current = requestAnimationFrame(step);
      prevAmountRef.current = amount;
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [amount]);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="jackpot-panel px-8 py-4 rounded-2xl mb-2">
        <h2 className="text-sm uppercase font-bold mb-1 opacity-80">Jackpot</h2>
        <div className="text-4xl font-bold">
          {displayedAmount.toFixed(2)}
        </div>
      </div>
      
      {lastWin > 0 && (
        <div className="glass-morphism px-4 py-2 rounded-lg animate-scale-up">
          <span className="text-gradient-gold font-bold">
            You Won: {lastWin.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default JackpotDisplay;
