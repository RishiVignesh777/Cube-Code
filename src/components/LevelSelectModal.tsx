import React, { useState } from 'react';
import { LevelDefinition, DifficultyLevel, PlayerLevelProgress } from '../game/types';
import { X, Star, Dices, Lock } from 'lucide-react';
import { sound } from '../game/audio';

interface LevelSelectModalProps {
  levels: LevelDefinition[];
  currentLevelId: string;
  progress: Record<string, PlayerLevelProgress>;
  onSelectLevel: (level: LevelDefinition) => void;
  onGenerateRandom: () => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  currentLevelId,
  progress,
  onSelectLevel,
  onGenerateRandom,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DifficultyLevel>('easy');

  const filteredLevels = levels.filter((l) => l.category === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Level Select Dialog"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Select Mission
            </h2>
            <p className="text-xs text-slate-400">
              Pick a puzzle or roll procedural challenges
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close level selector"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Category Tabs */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab(tab);
              }}
              className={`py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer border ${
                activeTab === tab
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
          {filteredLevels.map((lvl) => {
            const p = progress[lvl.id] || { stars: 0, completed: false, unlocked: true };
            const isSelected = lvl.id === currentLevelId;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{lvl.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-blue-300">
                    {lvl.type}
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">
                    {lvl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Par: {lvl.parMoves} moves
                  </div>
                </div>

                {/* Stars earned */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={`star-${lvl.id}-${starIdx}`}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= p.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-800 text-slate-700'
                      }`}
                    />
                  ))}
                  {p.completed && (
                    <span className="text-[10px] text-emerald-400 font-mono ml-auto">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Procedural Level Generator Button */}
        <div className="pt-4 mt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onGenerateRandom();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-xs"
          >
            <Dices className="w-4 h-4" />
            <span>Generate Random Solvable Puzzle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
