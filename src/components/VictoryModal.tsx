import React from 'react';
import { Star, RotateCcw, ArrowRight, Grid } from 'lucide-react';
import { sound } from '../game/audio';

interface VictoryModalProps {
  stars: number;
  moves: number;
  parMoves: number;
  timeSeconds: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stars,
  moves,
  parMoves,
  timeSeconds,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Level Complete Victory Modal"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-black relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Victory Stars Display */}
        <div className="flex justify-center items-center gap-2 mb-3">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={`star-result-${starIdx}`}
              className={`transform transition-all duration-500 ${
                starIdx <= stars ? 'scale-110' : 'scale-90 opacity-40'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                    : 'fill-slate-800 text-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide uppercase">
          {stars === 3 ? 'Flawless Solve!' : stars === 2 ? 'Great Job!' : 'Puzzle Solved!'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {moves <= parMoves
            ? `Achieved in ${moves} moves (Par: ${parMoves})`
            : `Completed in ${moves} moves`}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Moves
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {moves}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clear Time
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              type="button"
              data-start="true"
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-sm"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onLevelSelect();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              <Grid className="w-4 h-4" />
              <span>All Levels Complete!</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onLevelSelect();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer text-xs"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
