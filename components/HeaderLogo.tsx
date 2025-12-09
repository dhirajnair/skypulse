import React from 'react';

export const HeaderLogo = () => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative w-10 h-10 flex items-center justify-center bg-space-900 border border-space-800 rounded-full shadow-lg shadow-accent-purple/20">
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="galaxy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        {/* Galaxy 1 (Top Left) - Spiral Arms */}
        <path 
          d="M7 6c-2.5 1-3.5 4-2 6.5 1.5 2.5 4.5 3 6.5 1.5M8 8c-1.5.5-2 2.5-1 3.5" 
          stroke="url(#galaxy-grad)" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        
        {/* Galaxy 2 (Bottom Right) - Spiral Arms */}
        <path 
          d="M17 18c2.5-1 3.5-4 2-6.5-1.5-2.5-4.5-3-6.5-1.5M16 16c1.5-.5 2-2.5 1-3.5" 
          stroke="url(#galaxy-grad)" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        
        {/* Bridge/Interaction hint */}
        <path 
          d="M11.5 11.5L12.5 12.5" 
          stroke="url(#galaxy-grad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.6"
        />

        {/* Decorative Stars */}
        <circle cx="19" cy="5" r="0.8" fill="url(#galaxy-grad)" opacity="0.8" />
        <circle cx="5" cy="19" r="0.8" fill="url(#galaxy-grad)" opacity="0.6" />
      </svg>
    </div>
    <span className="font-display font-bold text-xl tracking-tight text-white">SkyPulse</span>
  </div>
);

export default HeaderLogo;