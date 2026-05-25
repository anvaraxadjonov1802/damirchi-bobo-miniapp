import React from 'react';
import { CheckCircle2, ChevronRight, Home } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { hapticFeedback } from '../telegram/telegram';

export default function SuccessPage({ orderDetails, onGoHome }) {
  const handleHomeClick = () => {
    hapticFeedback('medium');
    if (onGoHome) onGoHome();
  };

  const orderId = orderDetails?.id || Math.floor(100000 + Math.random() * 900000);
  const totalPrice = orderDetails?.total_price || 0;
  const paymentText = orderDetails?.payment_type === 'card' ? 'Karta' : 'Naqd';
  const statusText = {
    new: 'Yangi',
    accepted: 'Qabul qilindi',
    preparing: 'Tayyorlanmoqda',
    on_way: 'Yo‘lda',
    completed: 'Yetkazildi',
    cancelled: 'Bekor qilindi'
  }[orderDetails?.status] || orderDetails?.status || 'Yangi';

  return (
    <div className="px-5 py-10 flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in text-[#F5EFE6]">
      
      {/* Animated Success Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-emerald-950/20 rounded-full border-4 border-emerald-500/15 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-[scale-up_0.3s_ease-out]" />
        </div>
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-75" />
      </div>

      <h2 className="font-serif font-black text-3xl text-[#F5EFE6] mb-2 leading-tight">
        Buyurtma qabul qilindi!
      </h2>
      
      <p className="text-xs text-[#A8988C] leading-relaxed max-w-sm font-semibold mb-8">
        Buyurtmangiz operator guruhiga yuborildi. Tez orada restoran operatori siz bilan bog‘lanadi.
      </p>

      {/* Structured Ticket Receipt Details */}
      <div className="w-full max-w-sm bg-[#1C1511] border border-[#D99A2B]/12 rounded-[2rem] p-5 shadow-lg text-left mb-8 relative">
        {/* Notch cutouts resembling a paper receipt */}
        <div className="absolute -left-2 top-1/2 -mt-2 w-4 h-4 bg-[#120E0B] rounded-full border-r border-[#D99A2B]/12" />
        <div className="absolute -right-2 top-1/2 -mt-2 w-4 h-4 bg-[#120E0B] rounded-full border-l border-[#D99A2B]/12" />
        
        <h3 className="font-serif font-black text-xs text-[#D99A2B] uppercase tracking-[0.15em] mb-4 border-b border-dashed border-[#D99A2B]/15 pb-2.5">
          Kvitansiya ma’lumotlari
        </h3>

        <div className="flex flex-col gap-3 text-xs">
          <div className="flex justify-between items-center text-[#A8988C]">
            <span>Buyurtma raqami:</span>
            <span className="font-mono font-bold text-[#F5EFE6] text-sm">#{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center text-[#A8988C]">
            <span>Status:</span>
            <span className="bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              {statusText}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#A8988C]">
            <span>To‘lov usuli:</span>
            <span className="font-semibold text-[#F5EFE6]">{paymentText}</span>
          </div>

          <hr className="border-t border-dashed border-[#D99A2B]/12 my-1.5" />

          <div className="flex justify-between items-center text-[#F5EFE6] font-bold text-sm">
            <span className="font-serif">Umumiy miqdor:</span>
            <span className="font-serif font-black text-[#D99A2B] text-base">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={handleHomeClick}
          className="w-full py-4.5 bg-[#D99A2B] hover:bg-[#C98A1F] text-[#120E0B] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#D99A2B]/10 group cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#120E0B]" />
          <span>Menyuga qaytish</span>
          <ChevronRight className="w-4 h-4 text-[#120E0B] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
