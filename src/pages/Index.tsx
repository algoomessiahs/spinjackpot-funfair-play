
import React from 'react';
import SlotMachine from '@/components/SlotMachine';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <div className="glass-morphism px-6 py-3 rounded-xl inline-block">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient">Classic Slot Machine</h1>
        </div>
      </header>
      
      <main className="w-full max-w-4xl">
        <SlotMachine />
      </main>
      
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>© 2023 Pi Network Testnet | All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
