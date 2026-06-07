import React, { FC } from 'react';
import { AvatarConfig } from '../types';

interface CustomAvatarProps {
  config: AvatarConfig;
  className?: string;
}

const Head: FC<{ skinColor: string }> = ({ skinColor }) => (
  <g>
    {/* Neck */}
    <rect x="44" y="42" width="12" height="8" fill={skinColor} filter="brightness(0.8)" />
    {/* Head Base */}
    <rect x="28" y="8" width="44" height="38" rx="6" fill={skinColor} />
  </g>
);

const Face: FC = () => (
  <g>
    {/* Eyes */}
    <rect x="38" y="24" width="4" height="8" rx="2" fill="#111" />
    <rect x="58" y="24" width="4" height="8" rx="2" fill="#111" />
    <circle cx="39.5" cy="26" r="1.5" fill="#fff" />
    <circle cx="59.5" cy="26" r="1.5" fill="#fff" />

    {/* Eyebrows */}
    <path d="M 36 21 L 42 20 M 58 20 L 64 21" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />

    {/* Mouth */}
    <path d="M 44 35 Q 50 39 56 35" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
  </g>
);

const Hair: FC<{ style: string; color: string }> = ({ style, color }) => {
  switch (style) {
    case 'none': return null;
    case 'bacon':
      return (
        <g fill={color}>
          <path d="M 26 12 L 40 -2 L 50 8 L 60 -2 L 74 12 L 74 34 L 66 18 L 50 24 L 34 18 L 26 34 Z" />
          <path d="M 28 8 L 44 0 L 56 0 L 72 8 L 74 16 L 60 8 L 40 8 L 26 16 Z" filter="brightness(1.15)" />
          <path d="M 24 16 Q 30 10 38 18 Q 44 14 50 20 Q 56 12 62 18 Q 70 10 76 16" fill="none" stroke={color} strokeWidth="4" filter="brightness(0.85)" />
        </g>
      );
    case 'block_spiky':
      return (
        <g fill={color}>
          <path d="M 24 18 L 30 0 L 40 10 L 50 -4 L 60 10 L 70 0 L 76 18 L 72 30 L 64 20 L 50 24 L 36 20 L 28 30 Z" />
        </g>
      );
    case 'block_short':
      return (
        <g fill={color}>
          <rect x="24" y="4" width="52" height="12" rx="2" />
          <path d="M 24 16 L 76 16 L 76 28 L 66 18 L 50 22 L 34 18 L 24 28 Z" />
          <rect x="26" y="4" width="48" height="6" fill="#fff" opacity="0.1" />
        </g>
      );
    case 'block_messy':
      return (
        <g fill={color}>
          <rect x="22" y="8" width="14" height="14" rx="2" transform="rotate(-15 29 15)" />
          <rect x="64" y="8" width="14" height="14" rx="2" transform="rotate(15 71 15)" />
          <rect x="30" y="2" width="20" height="16" rx="2" transform="rotate(-5 40 10)" />
          <rect x="50" y="2" width="20" height="16" rx="2" transform="rotate(5 60 10)" />
          <rect x="40" y="-4" width="20" height="16" rx="2" />
          <path d="M 24 18 L 76 18 L 72 32 L 64 22 L 50 28 L 36 22 L 28 32 Z" />
        </g>
      );
    case 'block_fade':
      return (
        <g fill={color}>
          <rect x="26" y="2" width="48" height="10" rx="2" />
          <rect x="28" y="12" width="44" height="6" opacity="0.8" />
          <rect x="30" y="18" width="40" height="6" opacity="0.6" />
          <rect x="32" y="24" width="36" height="4" opacity="0.4" />
        </g>
      );
    case 'block_long':
      return (
        <g fill={color}>
          {/* Back/Sides */}
          <rect x="22" y="6" width="14" height="40" rx="3" />
          <rect x="64" y="6" width="14" height="40" rx="3" />
          <rect x="36" y="6" width="28" height="45" rx="3" />
          {/* Top */}
          <rect x="22" y="2" width="56" height="14" rx="3" />
          {/* Bangs */}
          <path d="M 22 16 L 78 16 L 76 26 C 60 18, 40 18, 24 26 Z" filter="brightness(1.1)" />
        </g>
      );
    default:
      return null;
  }
};

const Body: FC<{ style: string; color: string; skinColor: string }> = ({ style, color, skinColor }) => {
  const baseLimbs = (
    <g>
      {/* Torso Base */}
      <rect x="34" y="48" width="32" height="30" rx="3" fill={skinColor} />
      {/* Arms */}
      <rect x="18" y="48" width="14" height="28" rx="3" fill={skinColor} />
      <rect x="68" y="48" width="14" height="28" rx="3" fill={skinColor} />
      {/* Hands */}
      <rect x="19" y="77" width="12" height="10" rx="4" fill={skinColor} />
      <rect x="69" y="77" width="12" height="10" rx="4" fill={skinColor} />
      {/* Legs */}
      <rect x="36" y="79" width="13" height="25" rx="3" fill={skinColor} />
      <rect x="51" y="79" width="13" height="25" rx="3" fill={skinColor} />
    </g>
  );

  const pants = (
    <g fill="#2d3748">
      {/* Waist */}
      <rect x="34" y="72" width="32" height="8" fill="#1a202c" />
      {/* Legs Pants */}
      <rect x="36" y="79" width="13" height="15" rx="2" />
      <rect x="51" y="79" width="13" height="15" rx="2" />
    </g>
  );

  switch (style) {
    case 'basic':
      return (
        <g>
          {baseLimbs}
          {pants}
          {/* T-Shirt */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill={color} />
          {/* T-Shirt Sleeves */}
          <rect x="18" y="48" width="14" height="14" rx="3" fill={color} />
          <rect x="68" y="48" width="14" height="14" rx="3" fill={color} />
        </g>
      );
    case 'jacket':
      return (
        <g>
          {baseLimbs}
          {pants}
          {/* Undershirt */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#ffffff" />
          {/* Jacket Body */}
          <path d="M 34 48 L 44 48 L 40 72 L 34 72 Z" fill={color} />
          <path d="M 66 48 L 56 48 L 60 72 L 66 72 Z" fill={color} />
          {/* Sleeves */}
          <rect x="18" y="48" width="14" height="24" rx="3" fill={color} />
          <rect x="68" y="48" width="14" height="24" rx="3" fill={color} />
        </g>
      );
    case 'hoodie':
      return (
        <g>
          {baseLimbs}
          {pants}
          {/* Hoodie Body */}
          <rect x="33" y="47" width="34" height="26" rx="4" fill={color} />
          {/* Pocket */}
          <path d="M 40 60 L 60 60 L 64 70 L 36 70 Z" fill="#000" opacity="0.1" />
          {/* Sleeves */}
          <rect x="17" y="47" width="16" height="26" rx="4" fill={color} />
          <rect x="67" y="47" width="16" height="26" rx="4" fill={color} />
          {/* Strings */}
          <path d="M 45 47 L 45 56 M 55 47 L 55 56" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return baseLimbs;
  }
};

const Accessory: FC<{ style: string }> = ({ style }) => {
  switch (style) {
    case 'none': return null;
    case 'glasses':
      return (
        <g>
          <rect x="32" y="20" width="14" height="10" rx="2" fill="#1a1a1a" fillOpacity="0.8" />
          <rect x="54" y="20" width="14" height="10" rx="2" fill="#1a1a1a" fillOpacity="0.8" />
          <path d="M 46 25 L 54 25" stroke="#111" strokeWidth="2" />
          <path d="M 26 25 L 32 25 M 68 25 L 74 25" stroke="#111" strokeWidth="2" />
        </g>
      );
    case 'visor':
      return <rect x="26" y="18" width="48" height="12" rx="2" fill="#3BA8FF" opacity="0.85" />;
    case 'mask':
      return <rect x="28" y="32" width="44" height="14" rx="4" fill="#111" />;
    case 'headset':
      return (
        <g>
          <path d="M 25 12 C 25 -2, 75 -2, 75 12" fill="none" stroke="#222" strokeWidth="4"/>
          <rect x="22" y="14" width="8" height="16" rx="4" fill="#111"/>
          <rect x="70" y="14" width="8" height="16" rx="4" fill="#111"/>
          <circle cx="26" cy="22" r="3" fill="#3BA8FF"/>
          <circle cx="74" cy="22" r="3" fill="#3BA8FF"/>
          <path d="M 26 25 L 38 34" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="34" r="2" fill="#3BA8FF" />
        </g>
      );
    case 'catears':
      return (
        <g fill="#111">
          <polygon points="36,8 28,-4 44,0" />
          <polygon points="64,8 72,-4 56,0" />
          <polygon points="36,5 31,-1 41,1" fill="#ff4a4a" opacity="0.7" />
          <polygon points="64,5 69,-1 59,1" fill="#ff4a4a" opacity="0.7" />
        </g>
      );
    case 'tiara':
      return (
        <g>
          <path d="M 28 12 Q 50 16 72 12" fill="none" stroke="#FFD83D" strokeWidth="2" />
          <polygon points="50,2 44,12 56,12" fill="#FFD83D" />
          <circle cx="50" cy="6" r="2" fill="#fff" />
        </g>
      );
    case 'cybereye':
      return (
        <g>
          <rect x="54" y="20" width="16" height="10" rx="3" fill="#111" />
          <circle cx="62" cy="25" r="3" fill="#FF4A4A" className="animate-pulse" />
          <path d="M 70 25 L 76 25" stroke="#111" strokeWidth="2" fill="none" />
        </g>
      );
    default:
      return null;
  }
};

export const CustomAvatar: FC<CustomAvatarProps> = ({ config, className = '' }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="plastic-shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="transparent" />
      <rect width="100" height="100" fill="url(#bg-glow)" />
      
      <Body style={config.clothingStyle} color={config.clothingColor} skinColor={config.skinColor} />
      <Head skinColor={config.skinColor} />
      <Face />
      <Hair style={config.hairStyle} color={config.hairColor} />
      <Accessory style={config.accessory} />
    </svg>
  );
};

