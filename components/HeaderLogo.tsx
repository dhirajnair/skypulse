import React from 'react';

export const HeaderLogo = () => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative w-10 h-10 flex items-center justify-center bg-space-900 border border-space-800 rounded-full shadow-lg shadow-accent-purple/20">
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rocket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="url(#rocket-grad)"/>
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="url(#rocket-grad)"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4 0 4 0" fill="url(#rocket-grad)"/>
        <path d="M12 15v5s3.03-.55 4-2c1.1-1.62 0-4 0-4" fill="url(#rocket-grad)"/>
      </svg>
    </div>
    <span className="font-display font-bold text-xl tracking-tight text-white">SkyPulse</span>
  </div>
);

export default HeaderLogo;