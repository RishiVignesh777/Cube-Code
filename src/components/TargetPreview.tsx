import React from 'react';
import { Grid3x3, LevelDefinition } from '../game/types';
import { TileView } from './TileView';
import { Star, ShieldAlert } from 'lucide-react';

interface TargetPreviewProps {
  targetGrid: Grid3x3;
  level: LevelDefinition;
  currentMoves: number;
  colorblindMode: boolean;
}

export const TargetPreview: React.FC<TargetPreviewProps> = ({
  targetGrid,
  level,
  currentMoves,
  colorblindMode,
}) => {
  // Compute prospective stars based on current moves
  let activeStars = 3;
  if (currentMoves > level.parMoves + 2) {
    activeStars = 1;
  } else if (currentMoves > level.parMoves) {
    activeStars = 2;
  }

  const getConstraintLabel = () => {
    switch (level.constraint) {
      case 'no_adjacent_same_color':
        return 'Rule: No two blue tiles touching!';
      case 'corners_matching':
        return 'Rule: All 4 corners must match!';
      case 'center_match_all':
        return 'Rule: Center matches orthogonal neighbors!';
      case 'row_unique_colors':
        return 'Rule: Every row has 3 unique colors!';
      case 'col_unique_colors':
        return 'Rule: Every column has 3 unique colors!';
      default:
        return null;
    }
  };

  const constraintLabel = getConstraintLabel();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-between gap-4 max-w-[420px] w-full">
      {/* Left: Level Details and Star Rating */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full">
            {level.type}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Par: {level.parMoves} moves
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[200px]">
          {level.title}
        </h3>

        {/* Dynamic Star Pips */}
        <div className="flex items-center gap-1 mt-1.5" aria-label={`Current rating: ${activeStars} of 3 stars`}>
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={`star-${starIdx}`}
              className={`w-4 h-4 transition-all duration-300 ${
                starIdx <= activeStars
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                  : 'fill-slate-800 text-slate-700'
              }`}
            />
          ))}
          <span className="text-[11px] text-slate-400 ml-1 font-mono">
            {currentMoves <= level.parMoves
              ? '3★ pace'
              : currentMoves <= level.parMoves + 2
              ? '2★ pace'
              : '1★ pace'}
          </span>
        </div>

        {/* Constraint Warning if any */}
        {constraintLabel && (
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded-md">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-medium">{constraintLabel}</span>
          </div>
        )}
      </div>

      {/* Right: Miniature 3x3 Target Preview */}
      <div className="flex flex-col items-center shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Goal Target
        </span>
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 border border-slate-700/80 rounded-xl p-1.5 shadow-inner grid grid-cols-3 grid-rows-3 gap-1"
          aria-label="Target Goal Miniature Grid"
        >
          {targetGrid.map((row, r) =>
            row.map((tile, c) => (
              <TileView
                key={`target-${r}-${c}-${tile.id}`}
                tile={tile}
                colorblindMode={colorblindMode}
                size="mini"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
