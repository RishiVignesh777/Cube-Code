import React from 'react';
import { Tile, TileColor, SymbolShape } from '../game/types';
import { COLOR_HEX_MAP } from '../game/levels';

interface TileViewProps {
  tile: Tile;
  colorblindMode?: boolean;
  size?: 'normal' | 'mini' | 'preview';
  isHighlighted?: boolean;
}

export const TileView: React.FC<TileViewProps> = ({
  tile,
  colorblindMode = false,
  size = 'normal',
  isHighlighted = false,
}) => {
  const bgColor = COLOR_HEX_MAP[tile.color] || '#3B82F6';

  const renderSymbol = (symbol?: SymbolShape) => {
    if (!symbol) return null;
    const strokeWidth = size === 'mini' ? 3 : 2.5;

    switch (symbol) {
      case 'circle':
        return (
          <circle
            cx="12"
            cy="12"
            r="6.5"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
          />
        );
      case 'square':
        return (
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="1.5"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
          />
        );
      case 'triangle':
        return (
          <polygon
            points="12,5 19,18 5,18"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
          />
        );
      case 'diamond':
        return (
          <polygon
            points="12,4 19,12 12,20 5,12"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
          />
        );
      case 'star':
        return (
          <polygon
            points="12,4 14.5,9.5 20,10.2 16,14 17.2,19.5 12,16.5 6.8,19.5 8,14 4,10.2 9.5,9.5"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
          />
        );
      case 'cross':
        return (
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      default:
        return null;
    }
  };

  if (size === 'mini') {
    return (
      <div
        className="w-full h-full rounded-md flex items-center justify-center transition-all duration-200 select-none shadow-sm relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
        title={`${tile.color}${tile.numberVal ? ` #${tile.numberVal}` : ''}`}
      >
        {colorblindMode && (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            {renderSymbol(tile.symbol)}
          </svg>
        )}
        {tile.numberVal && !colorblindMode && (
          <span className="text-[10px] font-bold text-white drop-shadow-sm font-mono">
            {tile.numberVal}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center relative select-none transition-all duration-200 shadow-md ${
        isHighlighted
          ? 'ring-4 ring-amber-400 scale-[1.03] z-10 brightness-110 shadow-amber-500/30'
          : 'hover:brightness-105 active:scale-95'
      }`}
      style={{
        backgroundColor: bgColor,
        boxShadow: isHighlighted
          ? '0 0 20px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255,255,255,0.25)'
          : '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
      }}
    >
      {/* Subtle top gloss shine */}
      <div className="absolute inset-x-2 top-1.5 h-1/3 bg-white/10 rounded-t-lg pointer-events-none" />

      {/* Number Badge if sequence puzzle */}
      {tile.numberVal !== undefined && (
        <span
          className="text-2xl sm:text-3xl font-black text-white tracking-wider tabular-nums font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10"
        >
          {tile.numberVal}
        </span>
      )}

      {/* Accessibility / Colorblind Symbol */}
      {colorblindMode && (
        <svg
          className={`${
            tile.numberVal !== undefined ? 'w-4 h-4 sm:w-5 sm:h-5 mt-1' : 'w-7 h-7 sm:w-8 sm:h-8'
          } drop-shadow-md z-10`}
          viewBox="0 0 24 24"
        >
          {renderSymbol(tile.symbol)}
        </svg>
      )}

      {/* Color Name label for high accessibility on hover/focus */}
      <span className="sr-only">{tile.color} tile</span>
    </div>
  );
};
