
import { useRef, useEffect, useCallback } from 'react';

export const useSoundEffects = (soundEnabled: boolean) => {
  // Create refs for audio
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const jackpotSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sounds
  useEffect(() => {
    spinSoundRef.current = new Audio('/sounds/spin.mp3');
    winSoundRef.current = new Audio('/sounds/win.mp3');
    jackpotSoundRef.current = new Audio('/sounds/jackpot.mp3');
  }, []);

  // Function to play sounds
  const playSound = useCallback((sound: HTMLAudioElement | null) => {
    if (sound && soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Could not play sound:", err));
    }
  }, [soundEnabled]);

  return {
    spinSoundRef,
    winSoundRef,
    jackpotSoundRef,
    playSound
  };
};
