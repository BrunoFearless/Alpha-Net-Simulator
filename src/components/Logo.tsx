import { FC } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rainbow-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a3e635" />    {/* Lime */}
        <stop offset="20%" stopColor="#22d3ee" />   {/* Cyan */}
        <stop offset="40%" stopColor="#3b82f6" />   {/* Blue */}
        <stop offset="60%" stopColor="#f59e0b" />   {/* Amber / Yellow */}
        <stop offset="80%" stopColor="#ef4444" />   {/* Red */}
        <stop offset="100%" stopColor="#d946ef" />  {/* Fuchsia / Purple */}
      </linearGradient>
    </defs>

    {/* Outer Diamond */}
    <polygon points="50,2 98,50 50,98 2,50" fill="none" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />
    
    {/* Inner Diamond */}
    <polygon points="50,14 86,50 50,86 14,50" fill="none" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />

    {/* Connecting lines from inner diamond to outer diamond */}
    <line x1="50" y1="14" x2="50" y2="2" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />
    <line x1="86" y1="50" x2="98" y2="50" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />
    <line x1="50" y1="86" x2="50" y2="98" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />
    <line x1="14" y1="50" x2="2" y2="50" stroke="url(#rainbow-logo-grad)" strokeWidth="1.5" />

    {/* 4-Pointed Star */}
    <polygon 
      points="50,14 58,42 86,50 58,58 50,86 42,58 14,50 42,42" 
      fill="url(#rainbow-logo-grad)" 
    />

    {/* Circles at the star points */}
    <circle cx="50" cy="14" r="3" fill="url(#rainbow-logo-grad)" />
    <circle cx="86" cy="50" r="3" fill="url(#rainbow-logo-grad)" />
    <circle cx="50" cy="86" r="3" fill="url(#rainbow-logo-grad)" />
    <circle cx="14" cy="50" r="3" fill="url(#rainbow-logo-grad)" />
  </svg>
);
