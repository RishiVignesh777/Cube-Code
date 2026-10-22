import React from 'react';
import { X, HelpCircle, Move, Target, Award, Eye } from 'lucide-react';
import { sound } from '../game/audio';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="How to Play Help Dialog"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              How To Play Cube Code
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close help dialog"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 text-xs text-slate-300 leading-relaxed">
          {/* Rule 1: Toroidal Sliding */}
          <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Move className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-xs uppercase mb-0.5">
                1. Continuous Toroidal Shifts
              </h3>
              <p>
                Rows and columns slide circularly! Sliding a row right pushes the rightmost tile around to the leftmost slot. Swipe directly across any tile or tap the outer arrow buttons.
              </p>
            </div>
          </div>

          {/* Rule 2: Goal Matching */}
          <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-xs uppercase mb-0.5">
                2. Match The Goal Preview
              </h3>
              <p>
                Recreate the exact 3x3 pattern shown in the miniature top card. Puzzles test color palettes, numeric sequences (1 to 9), or special logic constraints (e.g. no adjacent matching colors).
              </p>
            </div>
          </div>

          {/* Rule 3: 3-Star Efficiency */}
          <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-xs uppercase mb-0.5">
                3. Earn 3 Stars
              </h3>
              <p>
                Match or beat the level <strong>Par</strong> move target to earn 3 Stars. Exceeding par drops your rating to 2 or 1 star.
              </p>
            </div>
          </div>

          {/* Rule 4: Accessibility & Hint */}
          <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Eye className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-xs uppercase mb-0.5">
                4. Hints & Colorblind Mode
              </h3>
              <p>
                Stuck? Tap <strong>Hint</strong> to compute the optimal BFS shortest path. Tap <strong>Symbols</strong> to toggle high-contrast geometric shape overlays for full colorblind accessibility.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow transition-all"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
