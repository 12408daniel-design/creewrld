import React from 'react';

interface GothicEmblemProps {
  size?: number;
  className?: string;
}

/**
 * Official CREEWRLD Interlocking Gothic Ribbon Emblem
 */
export const CreewrldEmblem: React.FC<GothicEmblemProps> = ({ size = 48, className = '' }) => {
  return (
    <img
      src="/images/creewrld-emblem.png"
      alt="CREEWRLD Emblem"
      width={size}
      height={size}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
};

interface StackedLogoProps {
  width?: number;
  className?: string;
}

/**
 * Official CREEWRLD Full Vertical Stacked Logo (Interlocking Emblem + "CREE WRLD" + Underline)
 */
export const CreewrldStackedLogo: React.FC<StackedLogoProps> = ({
  width = 160,
  className = '',
}) => {
  return (
    <img
      src="/images/creewrld-logo-full.png"
      alt="CREEWRLD Official Logo"
      width={width}
      className={`object-contain select-none ${className}`}
    />
  );
};

interface WordmarkImgProps {
  height?: number;
  className?: string;
}

/**
 * Official CREEWRLD Blackletter Wordmark extracted directly from the brand artwork
 */
export const CreewrldWordmark: React.FC<WordmarkImgProps> = ({ height = 20, className = '' }) => {
  return (
    <img
      src="/images/creewrld-wordmark.png"
      alt="CREE WRLD"
      style={{ height: `${height}px`, width: 'auto' }}
      className={`object-contain select-none ${className}`}
    />
  );
};

interface CreewrldLogoProps {
  emblemSize?: number;
  showSubtag?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Horizontal Header & Footer Lockup combining the official Interlocking Gothic Emblem
 * and official "CREE WRLD" Blackletter Wordmark.
 */
export const CreewrldLogo: React.FC<CreewrldLogoProps> = ({
  emblemSize = 48,
  showSubtag = true,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      <CreewrldEmblem
        size={emblemSize}
        className="transition-transform duration-300 group-hover:scale-105 shrink-0"
      />
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-2">
          <CreewrldWordmark height={compact ? 17 : 21} className="w-auto" />
        </div>
        {showSubtag && (
          <span className="font-cinzel font-semibold text-[9px] uppercase tracking-[0.26em] text-[#CCFF00] mt-1.5">
            CREEWRLD // NAIROBI ARCHIVE
          </span>
        )}
      </div>
    </div>
  );
};
