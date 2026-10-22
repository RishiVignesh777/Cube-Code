import React, { useEffect, useState } from 'react';
import { Play, Grid, FileCode, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenGDD: () => void;
  totalStars: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenGDD,
  totalStars,
}) => {
  const [cubeRotation, setCubeRotation] = useState(0);

  // Keyboard shortcut listener: Enter or Space starts game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sound.playClick();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-8 bg-slate-950 text-slate-100 select-none relative overflow-hidden"
      data-testid="title-screen"
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Star Counter */}
      <div className="w-full max-w-md flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-300 font-mono font-medium shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{totalStars} Stars Earned</span>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenGDD();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>GDD & Architecture</span>
        </button>
      </div>

      {/* Hero Showcase Centerpiece */}
      <div className="flex flex-col items-center justify-center my-auto z-10 max-w-md w-full text-center">
        {/* Interactive Rotating Isometric Cube Emblem */}
        <div
          onClick={() => {
            sound.playSlide();
            setCubeRotation((prev) => prev + 90);
          }}
          className="cursor-pointer transition-transform duration-500 ease-out hover:scale-105 active:scale-95 mb-6 relative group"
          title="Click to spin the logic cube!"
          role="button"
          tabIndex={0}
          aria-label="Interactive 3D isometric logic cube"
        >
          <svg
            className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${cubeRotation}deg)`, transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Top Plane */}
            <polygon
              points="50,10 85,30 50,50 15,30"
              fill="#2563EB"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* Left Plane */}
            <polygon
              points="15,30 50,50 50,90 15,70"
              fill="#1D4ED8"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* Right Plane */}
            <polygon
              points="50,50 85,30 85,70 50,90"
              fill="#10B981"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* 3x3 Isometric Subdivision lines */}
            {/* Top face lines */}
            <line x1="26.6" y1="23.3" x2="61.6" y2="43.3" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="38.3" y1="16.6" x2="73.3" y2="36.6" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="73.3" y1="23.3" x2="38.3" y2="43.3" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="61.6" y1="16.6" x2="26.6" y2="36.6" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity="0.8" />

            {/* Left face lines */}
            <line x1="26.6" y1="36.6" x2="26.6" y2="76.6" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="38.3" y1="43.3" x2="38.3" y2="83.3" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="15" y1="43.3" x2="50" y2="63.3" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="15" y1="56.6" x2="50" y2="76.6" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Right face lines */}
            <line x1="61.6" y1="43.3" x2="61.6" y2="83.3" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="73.3" y1="36.6" x2="73.3" y2="76.6" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="50" y1="63.3" x2="85" y2="43.3" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="50" y1="76.6" x2="85" y2="56.6" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.6" />
          </svg>
          <div className="text-[10px] uppercase font-mono text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to rotate
          </div>
        </div>

        {/* Title Lockup */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans drop-shadow-md">
          CUBE CODE
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xs mt-2 leading-relaxed">
          Toroidal Spatial Logic Puzzle. Rotate and slide circular rows and columns to match the target.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer text-base tracking-wide"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Game</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold py-3 px-6 rounded-2xl border border-slate-700/80 transition-all cursor-pointer text-sm"
          >
            <Grid className="w-4 h-4 text-emerald-400" />
            <span>Select Level (12 Levels)</span>
          </button>
        </div>
      </div>

      {/* Clean Control Hints Line */}
      <div className="w-full max-w-md text-center z-10 pt-4">
        <p className="text-[11px] sm:text-xs text-slate-400 font-mono tracking-wide">
          Swipe or Drag · Arrows to Shift · Z Undo · H Hint · Space to Start
        </p>
      </div>
    </div>
  );
};
