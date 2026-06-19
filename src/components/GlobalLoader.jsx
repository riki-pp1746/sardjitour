import React from 'react';
import logo from '../assets/logo.png';
export default function GlobalLoader({ title, subtitle, percent, fullScreen = false, children }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50/90 via-white/95 to-slate-50/90 flex flex-col items-center justify-center overflow-hidden"
    : "relative flex flex-col items-center justify-center p-16 min-h-[60vh] overflow-hidden bg-white/50 rounded-[2.5rem] border border-slate-200/50 shadow-[0_8px_40px_rgba(0,0,0,0.04)]";

  return (
    <div className={containerClasses}>
      {/* Concentric Background Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-blue-600/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-blue-600/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-blue-600/5 pointer-events-none" />

      {/* Main Logo Container */}
      <div className="relative flex flex-col items-center justify-center z-10 mb-10 mt-4">
        
        {/* The Teal Loading Rings */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* The rings */}
          <div className="absolute inset-[-4px] rounded-full border-[3px] border-blue-600/10 border-t-blue-600 animate-[spin_2s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-[2px] border-blue-500/10 border-b-blue-500 animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* The Pure SVG 3D Logo "A" and Diagram Rings */}
          <div className="relative flex flex-col items-center justify-center mt-2 w-32 h-32">
            
            {/* The Blueprint Animated Rings */}
            <div className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)]">
              {/* Outer dashed spinning ring */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] transform-gpu">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#2563eb" strokeWidth="0.5" opacity="0.4" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="20 10" strokeLinecap="round" />
              </svg>
              {/* Inner static fill ring (Animation removed for performance) */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform-gpu">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>

            {/* Fake GPU accelerated glow behind logo to save performance instead of heavy SVG drop-shadows */}
            <div className="absolute inset-0 m-auto w-16 h-16 bg-blue-400/30 rounded-full blur-[20px]" style={{ willChange: 'transform, opacity' }}></div>

            <img src={logo} alt="UR Sardjito Logo" className="relative w-20 h-20 z-10 animate-pulse drop-shadow-xl" />
            
            {percent !== undefined && percent !== null && (
              <span className="absolute -bottom-6 text-xs font-black text-blue-600 drop-shadow-sm bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                {percent}%
              </span>
            )}
          </div>
        </div>

        {/* UR Sardjito text */}
        <div className="flex flex-col items-center z-10 relative">
          <h1 className="font-sans font-black text-2xl tracking-[0.1em] mb-1" style={{
              background: 'linear-gradient(to right, #1d4ed8, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 2px rgba(59,130,246,0.2))'
          }}>
            UR SARDJITO
          </h1>
          <div className="flex items-center gap-2 w-full justify-center">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-600"></div>
            <span className="font-sans font-semibold tracking-[0.2em] text-blue-700 text-[9px] ml-1 uppercase">Sistem Informasi Terpadu</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-600"></div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <h2 className="text-2xl font-black text-slate-800 tracking-tight z-10 mb-3 text-center drop-shadow-sm">
        {title || 'Menunggu Dataset Utama'}
      </h2>
      
      {subtitle && (
        <p className="text-[14px] font-medium text-slate-500 z-10 mb-8 text-center max-w-md leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* 4 Pulsing Dots in Teal */}
      <div className={`flex gap-2.5 z-10 ${children ? 'mb-8' : ''}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.32s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.16s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-[bounce_1.4s_infinite_ease-in-out_both]" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:0.16s]" />
      </div>

      {/* Extra Action Buttons / Shimmers */}
      {children && (
        <div className="z-20 relative w-full max-w-md flex flex-col items-center">
          {children}
        </div>
      )}

      {/* Blueprint Diagram Animations & User CSS Corrections */}
      <style>{`
        /* Efek Cahaya Neon & Kristal (Logo 'A') */
        .a-logo {
          /* OPTIMASI PERFORMA: Filter SVG dihapus total untuk menghindari bottleneck rendering GPU. 
             Efek glow murni mengandalkan elemen background <div> di belakangnya. */
          
          /* Amplifikasi efek cahaya pada kristal */
          mix-blend-mode: normal; 
          
          /* Memaksa browser menggunakan Hardware Acceleration */
          will-change: transform;
        }

        /* Pengisian Gradien Dinamis (Fill Logo 'A') */
        .a-logo-fill {
          fill: url(#crystalGradientCorrected); 
        }
      `}</style>
    </div>
  );
}
