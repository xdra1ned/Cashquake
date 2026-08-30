import React, { useEffect, useState } from 'react';

export type AvatarId =
  | 'av_cat'
  | 'av_robot'
  | 'av_star'
  | 'av_crab'
  | 'av_ghost'
  | 'av_alien'
  | 'av_crown'
  | 'av_fox'
  | 'av_dragon'
  | 'av_ninja'
  | 'av_pizza';

export interface AvatarDefinition {
  id: AvatarId;
  name: string;
  description: string;
  category: 'avatar';
  price: number;
}

export const AVATAR_REGISTRY: Record<AvatarId, AvatarDefinition> = {
  av_cat: {
    id: 'av_cat',
    name: 'Mischief Cat',
    description: 'Agile, smug, and ready to extort rent.',
    category: 'avatar',
    price: 0,
  },
  av_robot: {
    id: 'av_robot',
    name: 'Cyber Bot',
    description: 'Programmed for maximum capital efficiency.',
    category: 'avatar',
    price: 0,
  },
  av_star: {
    id: 'av_star',
    name: 'Jasmine’s Star',
    description: 'Special creator sparkle avatar for good vibes.',
    category: 'avatar',
    price: 0,
  },
  av_crab: {
    id: 'av_crab',
    name: 'Snappy Crab',
    description: 'Sidesteps rent collectors with armored pincers.',
    category: 'avatar',
    price: 0,
  },
  av_ghost: {
    id: 'av_ghost',
    name: 'Spooky Phantom',
    description: 'Haunt your rivals whenever they land on your tiles.',
    category: 'avatar',
    price: 100,
  },
  av_alien: {
    id: 'av_alien',
    name: 'Cosmic Invader',
    description: 'Abducts property deeds from outer space.',
    category: 'avatar',
    price: 150,
  },
  av_crown: {
    id: 'av_crown',
    name: 'Monarch Crown',
    description: 'Only for true monopoly nobility.',
    category: 'avatar',
    price: 200,
  },
  av_fox: {
    id: 'av_fox',
    name: 'Sneaky Fox',
    description: 'Clever negotiator that always gets the trade.',
    category: 'avatar',
    price: 120,
  },
  av_dragon: {
    id: 'av_dragon',
    name: 'Fire Dragon',
    description: 'Burns down opposing portfolios with fiery rent.',
    category: 'avatar',
    price: 300,
  },
  av_ninja: {
    id: 'av_ninja',
    name: 'Shadow Ninja',
    description: 'Silent, deadly, and immune to bankrupt panic.',
    category: 'avatar',
    price: 180,
  },
  av_pizza: {
    id: 'av_pizza',
    name: 'Pizza Slice',
    description: 'Delicious capitalism at its finest.',
    category: 'avatar',
    price: 80,
  },
};

interface AvatarSilhouetteProps {
  avatarId?: string;
  color?: string;
  size?: number | string;
  className?: string;
  showBorder?: boolean;
}

/**
 * Renders a crisp SVG silhouette avatar.
 * Checks asset-slot `/assets/avatars/{avatarId}.svg` first; if not present,
 * renders the handcrafted vector fallback silhouette.
 */
export const AvatarSilhouette: React.FC<AvatarSilhouetteProps> = ({
  avatarId = 'av_star',
  color = '#EC4899',
  size = 24,
  className = '',
  showBorder = true,
}) => {
  const [customAssetUrl, setCustomAssetUrl] = useState<string | null>(null);

  // Normalize avatar ID in case an old icon was passed
  const id: AvatarId = (
    avatarId in AVATAR_REGISTRY
      ? avatarId
      : avatarId.includes('cat') || avatarId === '🐱'
      ? 'av_cat'
      : avatarId.includes('robot') || avatarId === '🤖'
      ? 'av_robot'
      : avatarId.includes('star') || avatarId === '⭐'
      ? 'av_star'
      : avatarId.includes('crab') || avatarId === '🦀'
      ? 'av_crab'
      : avatarId.includes('ghost') || avatarId === '👻'
      ? 'av_ghost'
      : avatarId.includes('alien') || avatarId === '👽'
      ? 'av_alien'
      : avatarId.includes('crown') || avatarId === '👑'
      ? 'av_crown'
      : avatarId.includes('fox') || avatarId === '🦊'
      ? 'av_fox'
      : avatarId.includes('dragon') || avatarId === '🐲'
      ? 'av_dragon'
      : avatarId.includes('ninja') || avatarId === '🥷'
      ? 'av_ninja'
      : avatarId.includes('pizza') || avatarId === '🍕'
      ? 'av_pizza'
      : 'av_star'
  ) as AvatarId;

  useEffect(() => {
    // Attempt checking if custom user artwork exists at /assets/avatars/{id}.svg
    const testPath = `/assets/avatars/${id}.svg`;
    const img = new Image();
    img.onload = () => setCustomAssetUrl(testPath);
    img.onerror = () => setCustomAssetUrl(null);
    img.src = testPath;
  }, [id]);

  if (customAssetUrl) {
    return (
      <img
        src={customAssetUrl}
        alt={id}
        style={{ width: size, height: size }}
        className={`object-contain select-none pointer-events-none ${className}`}
      />
    );
  }

  const renderVectorSilhouette = () => {
    switch (id) {
      case 'av_cat':
        // Mischief Cat: Pointed ears, sleek head silhouette, whisker apertures
        return (
          <g>
            <path
              d="M 6 10 L 10 3 L 14 7 L 18 7 L 22 3 L 26 10 C 27 15, 27 23, 23 27 C 19 30, 13 30, 9 27 C 5 23, 5 15, 6 10 Z"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Eye slits */}
            <circle cx="12" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="20" cy="16" r="1.5" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <polygon points="16,19 14.5,21 17.5,21" fill="#0F172A" />
          </g>
        );

      case 'av_robot':
        // Cyber Bot: Angular automaton chassis, antenna, visor cut
        return (
          <g>
            {/* Antenna */}
            <line x1="16" y1="2" x2="16" y2="7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="3" r="2" fill={color} stroke="#0F172A" strokeWidth="1" />
            {/* Head Box */}
            <rect
              x="6"
              y="7"
              width="20"
              height="20"
              rx="4"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
            />
            {/* Ear Bolts */}
            <rect x="3" y="13" width="3" height="8" rx="1.5" fill="#0F172A" />
            <rect x="26" y="13" width="3" height="8" rx="1.5" fill="#0F172A" />
            {/* Visor */}
            <rect x="9" y="12" width="14" height="5" rx="2" fill="#0F172A" />
            <circle cx="12" cy="14.5" r="1" fill="#22D3EE" />
            <circle cx="20" cy="14.5" r="1" fill="#22D3EE" />
            {/* Speaker Mouth */}
            <line x1="11" y1="21" x2="21" y2="21" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'av_star':
        // Jasmine’s Star: Faceted 8-point geometric star with diamond core
        return (
          <g>
            <polygon
              points="16,2 19.5,10.5 28,11 21.5,17 23.5,26 16,21 8.5,26 10.5,17 4,11 12.5,10.5"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Star facet highlights */}
            <polygon points="16,6 18,12 16,16 14,12" fill="#FFFFFF" fillOpacity="0.7" />
            <circle cx="16" cy="15" r="2" fill="#FFFFFF" />
          </g>
        );

      case 'av_crab':
        // Snappy Crab: Stalk eyes, pincers/claws, carapace, walking legs
        return (
          <g>
            {/* Walking legs (Left & Right) */}
            <path d="M 6 18 Q 2 19, 2 24 M 7 21 Q 4 23, 4 27 M 8 23 Q 6 27, 7 29" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 26 18 Q 30 19, 30 24 M 25 21 Q 28 23, 28 27 M 24 23 Q 26 27, 25 29" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Left Arm & Pincer */}
            <path d="M 10 16 Q 6 11, 4 7 Q 2 11, 4 14 Q 7 13, 10 16 Z" fill={color} stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M 4 7 Q 6 4, 8 7 Q 6 9, 4 7 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="1" />
            {/* Right Arm & Pincer */}
            <path d="M 22 16 Q 26 11, 28 7 Q 30 11, 28 14 Q 25 13, 22 16 Z" fill={color} stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M 28 7 Q 26 4, 24 7 Q 26 9, 28 7 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="1" />
            {/* Eye Stalks */}
            <line x1="12" y1="13" x2="11" y2="8" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="13" x2="21" y2="8" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="7.5" r="2.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
            <circle cx="21" cy="7.5" r="2.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
            <circle cx="11.5" cy="7.5" r="1.2" fill="#0F172A" />
            <circle cx="20.5" cy="7.5" r="1.2" fill="#0F172A" />
            {/* Main Carapace / Shell */}
            <ellipse
              cx="16"
              cy="19"
              rx="10"
              ry="7"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
            />
            {/* Cute Smile */}
            <path d="M 13.5 21 Q 16 23.5, 18.5 21" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <circle cx="11.5" cy="20" r="1" fill="#F43F5E" fillOpacity="0.8" />
            <circle cx="20.5" cy="20" r="1" fill="#F43F5E" fillOpacity="0.8" />
          </g>
        );

      case 'av_ghost':
        // Spooky Phantom: Floating spectral silhouette with dual-wisp base
        return (
          <g>
            <path
              d="M 6 16 C 6 8, 11 3, 16 3 C 21 3, 26 8, 26 16 L 26 27 L 22 23 L 18 27 L 14 23 L 10 27 L 6 23 Z"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            <ellipse cx="12" cy="13" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="20" cy="13" rx="2" ry="2.5" fill="#0F172A" />
            <circle cx="16" cy="19" r="2" fill="#0F172A" />
          </g>
        );

      case 'av_alien':
        // Cosmic Invader: Teardrop alien skull with oversized almond eye apertures
        return (
          <g>
            <path
              d="M 5 12 C 5 5, 10 2, 16 2 C 22 2, 27 5, 27 12 C 27 20, 21 28, 16 28 C 11 28, 5 20, 5 12 Z"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Almond Eyes */}
            <ellipse cx="11" cy="13" rx="3.5" ry="5" fill="#0F172A" transform="rotate(-20 11 13)" />
            <ellipse cx="21" cy="13" rx="3.5" ry="5" fill="#0F172A" transform="rotate(20 21 13)" />
            <circle cx="10" cy="12" r="1.5" fill="#FFFFFF" />
            <circle cx="20" cy="12" r="1.5" fill="#FFFFFF" />
          </g>
        );

      case 'av_crown':
        // Monarch Crown: Regal 5-point crown with base band
        return (
          <g>
            <path
              d="M 3 24 L 5 10 L 10 16 L 16 7 L 22 16 L 27 10 L 29 24 Z"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Base band */}
            <rect
              x="3"
              y="24"
              width="26"
              height="5"
              rx="1.5"
              fill="#0F172A"
              stroke="#0F172A"
              strokeWidth="1"
            />
            {/* Crown Jewel dots */}
            <circle cx="16" cy="7" r="1.5" fill="#FFFFFF" />
            <circle cx="5" cy="10" r="1.5" fill="#FFFFFF" />
            <circle cx="27" cy="10" r="1.5" fill="#FFFFFF" />
            <circle cx="16" cy="26.5" r="1.5" fill={color} />
          </g>
        );

      case 'av_fox':
        // Sneaky Fox: Angular polygonal fox mask with sharp muzzle
        return (
          <g>
            {/* Ears */}
            <polygon points="5,14 7,3 15,10" fill={color} stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="27,14 25,3 17,10" fill={color} stroke="#0F172A" strokeWidth="1.5" />
            {/* Face Shield */}
            <polygon
              points="6,12 26,12 28,19 16,29 4,19"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* White cheeks */}
            <polygon points="6,15 16,27 4,19" fill="#FFFFFF" fillOpacity="0.4" />
            <polygon points="26,15 16,27 28,19" fill="#FFFFFF" fillOpacity="0.4" />
            {/* Eyes */}
            <polygon points="9,15 13,17 10,18" fill="#0F172A" />
            <polygon points="23,15 19,17 22,18" fill="#0F172A" />
            {/* Nose */}
            <circle cx="16" cy="27" r="1.5" fill="#0F172A" />
          </g>
        );

      case 'av_dragon':
        // Fire Dragon: Crested horned draconic profile with ridge scales
        return (
          <g>
            <path
              d="M 5 26 L 8 18 L 6 9 L 14 12 L 20 4 L 20 12 L 27 15 L 23 20 L 26 26 L 17 23 Z"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Horn Highlight */}
            <polygon points="6,9 14,12 11,8" fill="#FFFFFF" fillOpacity="0.6" />
            {/* Eye */}
            <polygon points="14,15 17,16 14,18" fill="#0F172A" />
            <circle cx="15" cy="16.5" r="1" fill="#FEF08A" />
          </g>
        );

      case 'av_ninja':
        // Shadow Ninja: Hooded cowl with slit visor
        return (
          <g>
            <circle
              cx="16"
              cy="16"
              r="12"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
            />
            {/* Eye Visor Cutout */}
            <polygon points="9,13 23,13 22,18 10,18" fill="#0F172A" rx="1" />
            {/* Focused Eyes */}
            <line x1="11" y1="15.5" x2="14" y2="15.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="15.5" x2="21" y2="15.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Headband knot */}
            <polygon points="26,11 30,8 28,14" fill={color} stroke="#0F172A" strokeWidth="1" />
          </g>
        );

      case 'av_pizza':
      default:
        // Pizza Slice: Triangular slice with pepperoni apertures and crust
        return (
          <g>
            {/* Crust */}
            <path
              d="M 5 8 Q 16 3, 27 8 L 25 11 Q 16 7, 7 11 Z"
              fill="#D97706"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            {/* Slice Triangle */}
            <polygon
              points="6,9 26,9 16,28"
              fill={color}
              stroke="#0F172A"
              strokeWidth={showBorder ? '1.5' : '0'}
              strokeLinejoin="round"
            />
            {/* Pepperonis */}
            <circle cx="16" cy="14" r="2.5" fill="#DC2626" stroke="#0F172A" strokeWidth="1" />
            <circle cx="12" cy="20" r="2" fill="#DC2626" stroke="#0F172A" strokeWidth="1" />
            <circle cx="20" cy="18" r="2" fill="#DC2626" stroke="#0F172A" strokeWidth="1" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 32 32"
      style={{ width: size, height: size }}
      className={`select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderVectorSilhouette()}
    </svg>
  );
};
