import React from 'react';
import { Volume2, VolumeX, Grid, FileCode, HelpCircle } from 'lucide-react';
import { sound } from '../game/audio';

interface HeaderProps {
  currentLevelNumber: number;
  totalLevels: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLevelSelect: () => void;
  onOpenGDD: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevelNumber,
  totalLevels,
  isMuted,
  onToggleMute,
  onOpenLevelSelect,
  onOpenGDD,
  onOpenHelp,
}) => {
  return (
    <header className="w-full max-w-[440px] flex items-center justify-between py-2 px-3 border-b border-slate-800/80 bg-slate-900/60 rounded-xl mb-1">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2">
        <svg
          className="w-7 h-7 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Isometric Cube Top Face */}
          <polygon
            points="16,3 27,9.5 16,16 5,9.5"
            fill="#3B82F6"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Isometric Cube Left Face */}
          <polygon
            points="5,9.5 16,16 16,28.5 5,22"
            fill="#1D4ED8"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Isometric Cube Right Face */}
          <polygon
            points="16,16 27,9.5 27,22 16,28.5"
            fill="#10B981"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Central 3x3 Grid Dots */}
          <circle cx="16" cy="9.5" r="1.2" fill="#FFFFFF" />
          <circle cx="10.5" cy="19" r="1.2" fill="#FFFFFF" />
          <circle cx="21.5" cy="19" r="1.2" fill="#FFFFFF" />
        </svg>

        <div>
          <h1 className="text-base font-black tracking-wider text-white uppercase flex items-center gap-1.5 font-sans">
            CUBE CODE
          </h1>
        </div>
      </div>

      {/* Navigation & Controls cluster */}
      <div className="flex items-center gap-1.5">
        {/* Level Selector Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenLevelSelect();
          }}
          aria-label="Select Level"
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono">
            {currentLevelNumber > 50 ? 'Custom' : `${currentLevelNumber}/${totalLevels}`}
          </span>
        </button>

        {/* GDD & Architecture Viewer */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenGDD();
          }}
          aria-label="View Game Design Document & Architecture"
          title="Game Design Document & Technical Architecture"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all cursor-pointer"
        >
          <FileCode className="w-4 h-4" />
        </button>

        {/* Help / Instructions Modal */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenHelp();
          }}
          aria-label="How to play instructions"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Audio Mute Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleMute();
            sound.playClick();
          }}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
};
