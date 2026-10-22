import React from 'react';
import { SlideMove } from '../game/types';
import { RotateCcw, Undo2, Lightbulb, Play, Eye } from 'lucide-react';
import { sound } from '../game/audio';

interface ControlsProps {
  movesCount: number;
  maxMoves: number;
  parMoves: number;
  timerSeconds: number;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  onAutoStep: () => void;
  hintMove: SlideMove | null;
  hintPathLength: number | null;
  isCalculatingHint: boolean;
  colorblindMode: boolean;
  onToggleColorblind: () => void;
  disabled?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  movesCount,
  maxMoves,
  parMoves,
  timerSeconds,
  canUndo,
  onUndo,
  onReset,
  onHint,
  onAutoStep,
  hintMove,
  hintPathLength,
  isCalculatingHint,
  colorblindMode,
  onToggleColorblind,
  disabled = false,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getHintDescription = (move: SlideMove) => {
    const indexStr = `${move.index + 1}`;
    if (move.type === 'row') {
      return `Slide Row ${indexStr} ${move.direction.toUpperCase()}`;
    }
    return `Slide Col ${indexStr} ${move.direction.toUpperCase()}`;
  };

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-3">
      {/* Status Bar: Moves and Time */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 shadow-md">
        {/* Moves Display */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Moves
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold font-mono tabular-nums ${
                movesCount > maxMoves
                  ? 'text-rose-400'
                  : movesCount > parMoves
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {movesCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {maxMoves} max</span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Time
          </span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-200">
            {formatTime(timerSeconds)}
          </span>
        </div>

        {/* Colorblind Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleColorblind();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer ${
            colorblindMode
              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle colorblind symbols"
          aria-label="Toggle colorblind symbols"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Symbols</span>
        </button>
      </div>

      {/* Active Hint Banner if hint is active */}
      {hintMove && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs animate-fade-in shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-200">
              Optimal Next Move: {getHintDescription(hintMove)}
            </span>
            {hintPathLength !== null && (
              <span className="text-amber-400/80 font-mono">
                ({hintPathLength} moves left)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onAutoStep}
            disabled={disabled}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shadow"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            Apply Step
          </button>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="grid grid-cols-3 gap-2">
        {/* Hint Button */}
        <button
          type="button"
          onClick={() => {
            sound.playHint();
            onHint();
          }}
          disabled={disabled || isCalculatingHint}
          aria-label="Get optimal move hint"
          className="flex items-center justify-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 active:bg-amber-500/35 border border-amber-500/30 text-amber-300 font-semibold py-2.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm">
            {isCalculatingHint ? 'Solving...' : 'Hint'}
          </span>
        </button>

        {/* Undo Button */}
        <button
          type="button"
          onClick={() => {
            sound.playUndo();
            onUndo();
          }}
          disabled={disabled || !canUndo}
          aria-label="Undo last move"
          className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600/80 border border-slate-700 text-slate-200 font-medium py-2.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-40"
        >
          <Undo2 className="w-4 h-4" />
          <span className="text-xs sm:text-sm">Undo</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onReset();
          }}
          disabled={disabled}
          aria-label="Reset puzzle to initial state"
          className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600/80 border border-slate-700 text-slate-200 font-medium py-2.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-xs sm:text-sm">Reset</span>
        </button>
      </div>
    </div>
  );
};
