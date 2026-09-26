import React from 'react';
import logoImg from '../assets/stocksense-logo.png';

export default function StockSenseLogo({ className = "h-8 sm:h-9 md:h-10 w-auto", showBadge = false }) {
  return (
    <div className="flex items-center gap-2 select-none group">
      <img
        src={logoImg}
        alt="StockSense Logo"
        className={`${className} max-h-11 object-contain transition-transform duration-200 group-hover:scale-105`}
      />
      {showBadge && (
        <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-amber-50 text-brand-orange border border-amber-200/60 self-center">
          WMS Enterprise
        </span>
      )}
    </div>
  );
}
