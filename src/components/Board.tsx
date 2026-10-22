import React, { useRef, useState, useEffect } from 'react';
import { Grid3x3, SlideMove } from '../game/types';
import { TileView } from './TileView';
import { sound } from '../game/audio';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface BoardProps {
  grid: Grid3x3;
  onMove: (move: SlideMove) => void;
  colorblindMode: boolean;
  hintMove: SlideMove | null;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  grid,
  onMove,
  colorblindMode,
  hintMove,
  disabled = false,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; r: number; c: number } | null>(null);

  const handleShift = (move: SlideMove) => {
    if (disabled) return;
    sound.playSlide();
    onMove(move);
  };

  // Keyboard shortcut listener for active keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Prevent default window scrolling
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled]);

  // Touch and pointer swipe handlers
  const handlePointerDown = (e: React.PointerEvent, r: number, c: number) => {
    if (disabled) return;
    setTouchStart({ x: e.clientX, y: e.clientY, r, c });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchStart || disabled) return;

    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 25; // minimum drag distance in pixels

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe along touchStart.r
        const direction = dx > 0 ? 'right' : 'left';
        handleShift({
          type: 'row',
          index: touchStart.r as 0 | 1 | 2,
          direction,
        });
      } else {
        // Vertical swipe along touchStart.c
        const direction = dy > 0 ? 'down' : 'up';
        handleShift({
          type: 'col',
          index: touchStart.c as 0 | 1 | 2,
          direction,
        });
      }
    }

    setTouchStart(null);
  };

  const isRowHighlighted = (rowIdx: number) => {
    return hintMove?.type === 'row' && hintMove.index === rowIdx;
  };

  const isColHighlighted = (colIdx: number) => {
    return hintMove?.type === 'col' && hintMove.index === colIdx;
  };

  const isTileHighlighted = (r: number, c: number) => {
    if (!hintMove) return false;
    if (hintMove.type === 'row') return hintMove.index === r;
    if (hintMove.type === 'col') return hintMove.index === c;
    return false;
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none touch-none">
      {/* Top Shift Buttons (Columns Up) */}
      <div className="flex gap-2.5 sm:gap-3.5 mb-2 pl-9 sm:pl-11 pr-9 sm:pr-11 w-full max-w-[340px] sm:max-w-[400px] justify-between">
        {[0, 1, 2].map((colIdx) => {
          const isHint = hintMove?.type === 'col' && hintMove.index === colIdx && hintMove.direction === 'up';
          return (
            <button
              key={`col-up-${colIdx}`}
              type="button"
              onClick={() => handleShift({ type: 'col', index: colIdx as 0 | 1 | 2, direction: 'up' })}
              aria-label={`Slide column ${colIdx + 1} up`}
              disabled={disabled}
              className={`flex-1 h-8 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isHint
                  ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse scale-105'
                  : 'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          );
        })}
      </div>

      {/* Main Grid Row with Left & Right Handles */}
      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-[340px] sm:max-w-[400px] justify-center">
        {/* Left Shift Buttons (Rows Left) */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 w-8 sm:w-9 justify-between">
          {[0, 1, 2].map((rowIdx) => {
            const isHint = hintMove?.type === 'row' && hintMove.index === rowIdx && hintMove.direction === 'left';
            return (
              <button
                key={`row-left-${rowIdx}`}
                type="button"
                onClick={() => handleShift({ type: 'row', index: rowIdx as 0 | 1 | 2, direction: 'left' })}
                aria-label={`Slide row ${rowIdx + 1} left`}
                disabled={disabled}
                className={`w-8 h-8 sm:w-9 sm:h-9 aspect-square rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isHint
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse scale-105'
                    : 'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            );
          })}
        </div>

        {/* 3x3 Tile Grid Viewport */}
        <div
          ref={boardRef}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setTouchStart(null)}
          className="flex-1 aspect-square bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl shadow-black/50 relative overflow-hidden"
          role="grid"
          aria-label="3x3 Interactive Tile Grid"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 w-full h-full relative z-10">
            {grid.map((row, r) =>
              row.map((tile, c) => (
                <div
                  key={`tile-${r}-${c}-${tile.id}`}
                  onPointerDown={(e) => handlePointerDown(e, r, c)}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  role="gridcell"
                  aria-label={`Tile row ${r + 1} col ${c + 1}: ${tile.color}${tile.numberVal ? ` number ${tile.numberVal}` : ''}`}
                >
                  <TileView
                    tile={tile}
                    colorblindMode={colorblindMode}
                    isHighlighted={isTileHighlighted(r, c)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Shift Buttons (Rows Right) */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 w-8 sm:w-9 justify-between">
          {[0, 1, 2].map((rowIdx) => {
            const isHint = hintMove?.type === 'row' && hintMove.index === rowIdx && hintMove.direction === 'right';
            return (
              <button
                key={`row-right-${rowIdx}`}
                type="button"
                onClick={() => handleShift({ type: 'row', index: rowIdx as 0 | 1 | 2, direction: 'right' })}
                aria-label={`Slide row ${rowIdx + 1} right`}
                disabled={disabled}
                className={`w-8 h-8 sm:w-9 sm:h-9 aspect-square rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isHint
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse scale-105'
                    : 'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Shift Buttons (Columns Down) */}
      <div className="flex gap-2.5 sm:gap-3.5 mt-2 pl-9 sm:pl-11 pr-9 sm:pr-11 w-full max-w-[340px] sm:max-w-[400px] justify-between">
        {[0, 1, 2].map((colIdx) => {
          const isHint = hintMove?.type === 'col' && hintMove.index === colIdx && hintMove.direction === 'down';
          return (
            <button
              key={`col-down-${colIdx}`}
              type="button"
              onClick={() => handleShift({ type: 'col', index: colIdx as 0 | 1 | 2, direction: 'down' })}
              aria-label={`Slide column ${colIdx + 1} down`}
              disabled={disabled}
              className={`flex-1 h-8 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isHint
                  ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse scale-105'
                  : 'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          );
        })}
      </div>

      {/* Touch Gesture Prompt Clue */}
      <p className="text-[11px] text-slate-400 mt-2 tracking-wide font-medium">
        Swipe any row or column · or tap perimeter arrows
      </p>
    </div>
  );
};
