import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { hapticFeedback } from '../telegram/telegram';

export default function ErrorState({ title = "Xatolik yuz berdi", message = "Tarmoq ulanishida uzilish qayd etildi. Iltimos, qayta urunib ko‘ring.", onRetry }) {
  const handleRetry = () => {
    hapticFeedback('medium');
    if (onRetry) onRetry();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#1C1511] rounded-[2rem] border border-red-950/45 shadow-lg max-w-sm mx-auto my-12 animate-fade-in text-[#F5EFE6]">
      <div className="w-16 h-16 bg-red-950/35 rounded-full flex items-center justify-center mb-4 border border-red-900/40">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="text-lg font-black text-[#F5EFE6] mb-2 font-serif">
        {title}
      </h3>
      
      <p className="text-[#A8988C] text-xs leading-relaxed mb-6 font-medium">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-xs font-black active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Qayta urinish</span>
        </button>
      )}
    </div>
  );
}
