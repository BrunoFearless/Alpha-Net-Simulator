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
          {/* Classic Roblox Bacon Wavy Strips */}
          <rect x="24" y="12" width="6" height="24" rx="2" />
          <rect x="70" y="12" width="6" height="24" rx="2" />
          {/* Top block */}
          <rect x="26" y="4" width="48" height="10" rx="3" />
          {/* Bacon curls / strips on top */}
          <rect x="30" y="0" width="10" height="6" rx="2" fill={color} filter="brightness(1.2)" />
          <rect x="45" y="-2" width="10" height="8" rx="2" fill={color} filter="brightness(1.1)" />
          <rect x="60" y="0" width="10" height="6" rx="2" fill={color} filter="brightness(1.2)" />
          {/* Strands hanging down */}
          <path d="M 24 16 L 32 26 L 28 34 Z" />
          <path d="M 76 16 L 68 26 L 72 34 Z" />
        </g>
      );
    case 'chestnut':
      return (
        <g fill={color}>
          {/* Main rectangular block cap */}
          <rect x="25" y="4" width="50" height="15" rx="2" />
          {/* Side burns */}
          <rect x="25" y="14" width="6" height="12" />
          <rect x="69" y="14" width="6" height="12" />
          {/* Hair split bang (classic part) */}
          <rect x="46" y="4" width="8" height="10" fill="#000" opacity="0.15" />
          <path d="M 25 14 C 38 10, 62 10, 75 14 L 75 20 Q 50 15 25 20 Z" filter="brightness(1.1)" />
        </g>
      );
    case 'blue_hair':
      return (
        <g fill={color}>
          {/* Base box cap */}
          <rect x="24" y="6" width="52" height="12" rx="3" />
          {/* Left messy spikes */}
          <rect x="20" y="4" width="12" height="12" rx="2" transform="rotate(-15 26 10)" />
          <rect x="32" y="0" width="12" height="14" rx="2" transform="rotate(-5 38 7)" />
          {/* Right messy spikes */}
          <rect x="56" y="0" width="12" height="14" rx="2" transform="rotate(5 62 7)" />
          <rect x="68" y="4" width="12" height="12" rx="2" transform="rotate(15 74 10)" />
          {/* Central high blocky strand */}
          <rect x="44" y="-4" width="12" height="16" rx="3" />
          {/* Front jagged fringe */}
          <path d="M 24 14 L 76 14 L 76 22 L 66 16 L 56 20 L 46 14 L 36 18 L 24 24 Z" filter="brightness(1.15)" />
        </g>
      );
    case 'aesthetic_black':
      return (
        <g fill={color}>
          {/* Rounded dense block cut */}
          <rect x="26" y="2" width="48" height="18" rx="4" />
          {/* Smooth side sweeps */}
          <rect x="26" y="14" width="8" height="14" rx="1" />
          <rect x="66" y="14" width="8" height="14" rx="1" />
          {/* Low layered bangs over forehead */}
          <path d="M 26 16 C 36 12, 64 12, 74 16 L 74 24 Q 50 18 26 24 Z" />
          <path d="M 32 18 C 40 14, 60 14, 68 18 L 68 22 Q 50 18 32 22 Z" filter="brightness(1.2)" />
        </g>
      );
    case 'block_mohawk':
      return (
        <g fill={color}>
          {/* Shaved sides representation */}
          <rect x="28" y="10" width="44" height="16" rx="2" fill="#000" opacity="0.3" />
          {/* High central block spikes running down center */}
          <rect x="44" y="-8" width="12" height="16" rx="2" />
          <rect x="44" y="-14" width="12" height="10" rx="2" filter="brightness(1.1)" />
          <rect x="44" y="2" width="12" height="12" />
          {/* Extra spiky modular blocks */}
          <rect x="46" y="-12" width="8" height="26" rx="2" />
          <rect x="44" y="8" width="12" height="14" />
        </g>
      );
    case 'fire_hair':
      return (
        <g>
          {/* Base head cap backing */}
          <rect x="25" y="4" width="50" height="12" rx="2" fill="#ef4444" />
          {/* Spiky block flames of different heights and positions */}
          <rect x="28" y="-12" width="10" height="20" rx="2" fill="#ea580c" />
          <rect x="36" y="-18" width="12" height="26" rx="2" fill="#f97316" />
          <rect x="44" y="-24" width="12" height="32" rx="2" fill="#facc15" />
          <rect x="52" y="-18" width="12" height="26" rx="2" fill="#f97316" />
          <rect x="62" y="-12" width="10" height="20" rx="2" fill="#ea580c" />
          {/* Glowing hot points */}
          <polygon points="34,-12 30,-2 38,-2" fill="#ef4444" />
          <polygon points="42,-18 36,-6 48,-6" fill="#facc15" />
          <polygon points="50,-24 44,-10 56,-10" fill="#ffffff" />
          <polygon points="58,-18 52,-6 64,-6" fill="#facc15" />
          <polygon points="66,-12 62,-2 70,-2" fill="#ef4444" />
        </g>
      );
    case 'crystal_hair':
      return (
        <g>
          {/* Base crystal structures */}
          <rect x="26" y="2" width="48" height="12" rx="2" fill="#a855f7" opacity="0.8" />
          {/* Crystal columns protruding at angles */}
          <rect x="30" y="-14" width="10" height="20" rx="2" fill="#c084fc" transform="rotate(-15 35 -4)" opacity="0.9" />
          <rect x="44" y="-22" width="12" height="28" rx="2" fill="#818cf8" transform="rotate(5 50 -8)" opacity="0.9" />
          <rect x="60" y="-14" width="10" height="20" rx="2" fill="#c084fc" transform="rotate(15 65 -4)" opacity="0.9" />
          {/* Top crystalline spikes */}
          <polygon points="30,-14 35,-22 40,-14" fill="#e9d5ff" />
          <polygon points="44,-22 50,-32 56,-22" fill="#eef2ff" />
          <polygon points="60,-14 65,-22 70,-14" fill="#e9d5ff" />
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
    case 'police':
      return (
        <g>
          {baseLimbs}
          {/* Dark Navy Pants */}
          <g fill="#0f172a">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="15" rx="1" />
            <rect x="51" y="79" width="13" height="15" rx="1" />
          </g>
          {/* Police Uniform shirt (Navy or Light Blue) */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#1e3a8a" />
          {/* Uniform Sleeves */}
          <rect x="18" y="48" width="14" height="16" rx="2" fill="#1e3a8a" />
          <rect x="68" y="48" width="14" height="16" rx="2" fill="#1e3a8a" />
          {/* Gold Badge */}
          <polygon points="56,54 60,51 64,54 62,60 58,60" fill="#ffd83d" />
          {/* Pockets */}
          <rect x="38" y="53" width="6" height="8" fill="#172554" rx="1" />
          <rect x="46" y="53" width="6" height="8" fill="#172554" rx="1" />
          {/* Police tie */}
          <path d="M 50 48 L 52 48 L 51 64 Z" fill="#0f172a" />
        </g>
      );
    case 'suit':
      return (
        <g>
          {baseLimbs}
          {/* Suit trousers */}
          <g fill="#1a1a1a">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="18" rx="1" />
            <rect x="51" y="79" width="13" height="18" rx="1" />
          </g>
          {/* Suit jacket */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill={color} />
          {/* Sleeves */}
          <rect x="18" y="48" width="14" height="26" rx="3" fill={color} />
          <rect x="68" y="48" width="14" height="26" rx="3" fill={color} />
          {/* White Undershirt Collar V-neck */}
          <polygon points="42,48 58,48 50,62" fill="#ffffff" />
          {/* Chic Red necktie */}
          <polygon points="48,48 52,48 50,56" fill="#e11d48" />
          <polygon points="50,55 48,65 52,65" fill="#e11d48" />
          {/* Lapels outline */}
          <line x1="42" y1="48" x2="45" y2="60" stroke="#000" strokeWidth="1.5" opacity="0.2" />
          <line x1="58" y1="48" x2="55" y2="60" stroke="#000" strokeWidth="1.5" opacity="0.2" />
        </g>
      );
    case 'ninja':
      return (
        <g>
          {baseLimbs}
          {/* Ninja Dark Pants */}
          <g fill="#171717">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="15" rx="1" />
            <rect x="51" y="79" width="13" height="15" rx="1" />
          </g>
          {/* Dark robes */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#171717" />
          <rect x="18" y="48" width="14" height="26" rx="3" fill="#171717" />
          <rect x="68" y="48" width="14" height="26" rx="3" fill="#171717" />
          {/* Neon Purple Sash wrap */}
          <path d="M 34 48 L 66 72" stroke="#a21caf" strokeWidth="3.5" />
          <path d="M 66 48 L 34 72" stroke="#a21caf" strokeWidth="2" opacity="0.6" />
          {/* Purple Arm and Shin bandages */}
          <rect x="18" y="64" width="14" height="5" fill="#a21caf" />
          <rect x="68" y="64" width="14" height="5" fill="#a21caf" />
          <rect x="36" y="82" width="13" height="5" fill="#a21caf" />
          <rect x="51" y="82" width="13" height="5" fill="#a21caf" />
        </g>
      );
    case 'knight':
      return (
        <g>
          {baseLimbs}
          {/* Heavy Steel Armor Pants */}
          <g fill="#475569">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="16" rx="1" fill="#475569" />
            <rect x="51" y="79" width="13" height="16" rx="1" fill="#475569" />
          </g>
          {/* Steel Breastplate */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#64748b" />
          {/* Heavy Pauldrons (Shoulder guards) */}
          <rect x="15" y="44" width="20" height="12" rx="3" fill="#94a3b8" />
          <rect x="65" y="44" width="20" height="12" rx="3" fill="#94a3b8" />
          {/* Metal Sleeves */}
          <rect x="18" y="56" width="14" height="18" rx="2" fill="#64748b" />
          <rect x="68" y="56" width="14" height="18" rx="2" fill="#64748b" />
          {/* Golden Crest Emblem (Sword silhouette) */}
          <path d="M 50 51 L 50 67 M 46 55 L 54 55" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Plate panel highlights */}
          <rect x="37" y="51" width="2" height="18" fill="#fff" opacity="0.15" />
          <rect x="61" y="51" width="2" height="18" fill="#000" opacity="0.15" />
        </g>
      );
    case 'hoodie_neon':
      return (
        <g>
          {baseLimbs}
          {/* Black stylish joggers */}
          <g fill="#18181b">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="15" rx="1" />
            <rect x="51" y="79" width="13" height="15" rx="1" />
          </g>
          {/* Neon body windbreaker */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#06b6d4" />
          <rect x="18" y="48" width="14" height="24" rx="3" fill="#06b6d4" />
          <rect x="68" y="48" width="14" height="24" rx="3" fill="#06b6d4" />
          {/* Vivid neon stripes */}
          <rect x="34" y="58" width="32" height="3" fill="#10b981" />
          <rect x="18" y="58" width="14" height="3" fill="#10b981" />
          <rect x="68" y="58" width="14" height="3" fill="#10b981" />
          {/* Black graphic imprint */}
          <rect x="42" y="52" width="16" height="4" rx="1" fill="#18181b" />
          <rect x="44" y="64" width="12" height="6" rx="2" fill="#18181b" />
        </g>
      );
    case 'streetwear':
      return (
        <g>
          {baseLimbs}
          {/* Cargo pants with straps */}
          <g fill="#111827">
            <rect x="34" y="72" width="32" height="8" />
            <rect x="36" y="79" width="13" height="16" rx="1" />
            <rect x="51" y="79" width="13" height="16" rx="1" />
            {/* Cargo pocket bulge */}
            <rect x="33" y="82" width="4" height="8" rx="1" fill="#1f2937" />
            <rect x="63" y="82" width="4" height="8" rx="1" fill="#1f2937" />
          </g>
          {/* Cyberpunk modern Kimono layer */}
          <rect x="34" y="48" width="32" height="24" rx="3" fill="#1f2937" />
          {/* Wide flowing sleeves */}
          <rect x="16" y="48" width="18" height="22" rx="4" fill="#1f2937" />
          <rect x="66" y="48" width="18" height="22" rx="4" fill="#1f2937" />
          {/* Neon pink trim */}
          <path d="M 34 48 L 50 68" stroke="#ec4899" strokeWidth="2.5" />
          <path d="M 66 48 L 50 68" stroke="#ec4899" strokeWidth="2.5" />
          {/* Glowing sleeve bands */}
          <rect x="16" y="62" width="18" height="4" fill="#ec4899" />
          <rect x="66" y="62" width="18" height="4" fill="#ec4899" />
          {/* Golden belt buckle */}
          <rect x="46" y="70" width="8" height="4" rx="1" fill="#fbbf24" />
        </g>
      );
    default:
      return baseLimbs;
  }
};

const Accessory: FC<{ style: string }> = ({ style }) => {
  switch (style) {
    case 'none': return null;
    case 'aviator_shades':
      return (
        <g>
          {/* Gold thin temples */}
          <rect x="24" y="23" width="8" height="2.5" fill="#f59e0b" />
          <rect x="68" y="23" width="8" height="2.5" fill="#f59e0b" />
          {/* Thin gold bridge connector */}
          <rect x="46" y="24" width="8" height="2" fill="#ffd83d" />
          {/* Main sleek aviator lens covers */}
          <rect x="31" y="20" width="16" height="12" rx="4" fill="#f59e0b"/>
          <rect x="32" y="21" width="14" height="10" rx="3" fill="#18181b" />
          <rect x="53" y="20" width="16" height="12" rx="4" fill="#f59e0b"/>
          <rect x="54" y="21" width="14" height="10" rx="3" fill="#18181b" />
          {/* Shiny cool lens glare effects */}
          <polygon points="34,22 40,22 36,28" fill="#ffffff" opacity="0.25" />
          <polygon points="56,22 62,22 58,28" fill="#ffffff" opacity="0.25" />
        </g>
      );
    case 'tophat':
      return (
        <g>
          {/* Lowered snug-fit cylindrical brim */}
          <rect x="20" y="7" width="60" height="4" fill="#1a1a1a" rx="1.5" />
          {/* High Top Crown block sitting exactly on y=7 */}
          <rect x="30" y="-14" width="40" height="21" fill="#1a1a1a" rx="2" />
          {/* Striking Red Felt Ribbon Band */}
          <rect x="30" y="3" width="40" height="4" fill="#ef4444" />
        </g>
      );
    case 'headphones':
      return (
        <g>
          {/* Headset upper rigid steel bracket bar aligned snugly with head top */}
          <path d="M 28 12 Q 50 1, 72 12" fill="none" stroke="#27272a" strokeWidth="5" />
          <path d="M 28 12 Q 50 1, 72 12" fill="none" stroke="#52525b" strokeWidth="2.5" />
          {/* Massive Block Left Muff */}
          <rect x="20" y="16" width="10" height="20" rx="3" fill="#18181b" />
          <rect x="22" y="20" width="6" height="12" rx="1" fill="#3b82f6" opacity="0.9" />
          {/* Massive Block Right Muff */}
          <rect x="70" y="16" width="10" height="20" rx="3" fill="#18181b" />
          <rect x="72" y="20" width="6" height="12" rx="1" fill="#3b82f6" opacity="0.9" />
        </g>
      );
    case 'ninja_mask':
      return (
        <g>
          {/* Solid fabric wrap covering lower cheeks and mouth */}
          <rect x="28" y="30" width="44" height="16" rx="3" fill="#18181b" />
          {/* Mask stitchings */}
          <line x1="34" y1="38" x2="66" y2="38" stroke="#374151" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Tie strings flapping back onto the neck side */}
          <path d="M 28 38 L 18 46 L 20 49 Z" fill="#18181b" />
        </g>
      );
    case 'valk_horns':
      return (
        <g>
          {/* Left Wing helm accent */}
          <rect x="22" y="16" width="6" height="12" rx="2" fill="#f59e0b" />
          <polygon points="22,16 6,4 18,10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="22,22 2,12 16,16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="22,28 8,24 18,22" fill="#cbd5e1" />
          
          {/* Right Wing helm accent */}
          <rect x="72" y="16" width="6" height="12" rx="2" fill="#f59e0b" />
          <polygon points="78,16 94,4 82,10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="78,22 98,12 84,16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <polygon points="78,28 92,24 82,22" fill="#cbd5e1" />
        </g>
      );
    case 'block_crown':
      return (
        <g>
          {/* Thick Solid Gold Base Band */}
          <rect x="26" y="2" width="48" height="6" fill="#fbbf24" rx="1" />
          {/* Golden Spikes */}
          <polygon points="26,2 34,2 30,-6" fill="#f59e0b" />
          <polygon points="34,2 43,2 38.5,-10" fill="#d97706" />
          {/* Tall center spike with Ruby diamond */}
          <polygon points="44,2 56,2 50,-15" fill="#fbbf24" />
          <rect x="48.5" y="-5" width="3" height="3.5" fill="#ef4444" rx="0.5" />
          
          <polygon points="57,2 66,2 61.5,-10" fill="#d97706" />
          <polygon points="66,2 74,2 70,-6" fill="#f59e0b" />
          {/* Emerald diamond gems inside base */}
          <rect x="32" y="3.5" width="2" height="3" fill="#10b981" />
          <rect x="49" y="3.5" width="2" height="3" fill="#3b82f6" />
          <rect x="66" y="3.5" width="2" height="3" fill="#10b981" />
        </g>
      );
    case 'halo':
      return (
        <g>
          {/* Golden luminous ring hovering directly parallel over crown */}
          <ellipse cx="50" cy="-6" rx="20" ry="5.5" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <ellipse cx="50" cy="-6" rx="20" ry="5.5" fill="none" stroke="#fef08a" strokeWidth="1.5" />
          <ellipse cx="50" cy="-6" rx="22" ry="7" fill="none" stroke="#fef08a" strokeWidth="2" opacity="0.3" />
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

