
import React from 'react';
import SlotMachine from '@/components/SlotMachine';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <div className="bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl inline-block shadow-sm border border-white/40">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Classic Slot Machine</h1>
        </div>
      </header>
      
      <main className="w-full max-w-4xl">
        <SlotMachine />
      </main>
      
      <footer className="mt-8 text-center text-xs text-slate-600">
        <p>© 2023 Pi Network Testnet | All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
