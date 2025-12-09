import React from 'react';

export const HeroTelescope = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tele-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    
    {/* Tripod Back Leg (dimmed for depth) */}
    <path d="M32 40L32 60" stroke="url(#tele-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    
    {/* Tripod Front Legs */}
    <path d="M32 40L18 60" stroke="url(#tele-grad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 40L46 60" stroke="url(#tele-grad)" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Mount Pivot */}
    <path d="M27 35H37L32 42L27 35Z" fill="url(#tele-grad)" />
    
    {/* Main Optical Tube - Elongated */}
    <path d="M10 54L54 10" stroke="url(#tele-grad)" strokeWidth="8" strokeLinecap="round" />
    
    {/* Tube Highlight (Glossy effect) */}
    <path d="M12 52L52 12" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    
    {/* Finder Scope */}
    <path d="M22 36L42 16" stroke="url(#tele-grad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    
    {/* Eyepiece Assembly */}
    <path d="M10 54L6 58" stroke="url(#tele-grad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M6 58L4 58" stroke="url(#tele-grad)" strokeWidth="2" strokeLinecap="round" />

    {/* Decorative Star/Glint */}
    <path d="M56 6L57 9L60 10L57 11L56 14L55 11L52 10L55 9Z" fill="#F59E0B" opacity="0.9" />
  </svg>
);

export default HeroTelescope;