import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Grid3x3,
  SlideMove,
  LevelDefinition,
  MoveHistoryRecord,
  PlayerLevelProgress,
  GameScreen,
} from './game/types';
import { LEVELS, generateProceduralLevel } from './game/levels';
import {
  applyMove,
  getInverseMove,
  cloneGrid,
  isWinningState,
  solveBFS,
  calculateStars,
} from './game/logic';
import { sound } from './game/audio';
import { TitleScreen } from './components/TitleScreen';
import { Header } from './components/Header';
import { TargetPreview } from './components/TargetPreview';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GDDModal } from './components/GDDModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  // Game screens
  const [screen, setScreen] = useState<GameScreen>('title');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<LevelDefinition>(LEVELS[0]);

  // Board state
  const [grid, setGrid] = useState<Grid3x3>(() => cloneGrid(LEVELS[0].initialGrid));
  const [history, setHistory] = useState<MoveHistoryRecord[]>([]);
  const [movesCount, setMovesCount] = useState(0);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Hint state
  const [hintMove, setHintMove] = useState<SlideMove | null>(null);
  const [hintPathLength, setHintPathLength] = useState<number | null>(null);
  const [isCalculatingHint, setIsCalculatingHint] = useState(false);

  // Settings & Progress state
  const [colorblindMode, setColorblindMode] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [progress, setProgress] = useState<Record<string, PlayerLevelProgress>>({});

  // Modals
  const [showVictory, setShowVictory] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showGDD, setShowGDD] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Victory metrics snapshot
  const [lastWinStats, setLastWinStats] = useState<{
    stars: number;
    moves: number;
    time: number;
  }>({ stars: 3, moves: 0, time: 0 });

  // Load saved progress from localStorage on boot
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem('cube_code_progress');
      if (savedProg) {
        setProgress(JSON.parse(savedProg));
      }
      const savedCb = localStorage.getItem('cube_code_colorblind');
      if (savedCb === 'true') {
        setColorblindMode(true);
      }
    } catch {}

    // Check for ?autostart=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setScreen('playing');
      setIsTimerRunning(true);
      document.body.dataset.state = 'playing';
    } else {
      document.body.dataset.state = 'title';
    }
  }, []);

  // Sync body dataset state
  useEffect(() => {
    if (showVictory) {
      document.body.dataset.state = 'gameover';
    } else if (screen === 'playing') {
      document.body.dataset.state = 'playing';
    } else if (screen === 'title') {
      document.body.dataset.state = 'title';
    } else {
      document.body.dataset.state = screen;
    }
  }, [screen, showVictory]);

  // Timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && screen === 'playing' && !showVictory) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, screen, showVictory]);

  // Total stars calculated
  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);

  // Load a new level
  const loadLevel = useCallback((lvl: LevelDefinition) => {
    setCurrentLevel(lvl);
    setGrid(cloneGrid(lvl.initialGrid));
    setHistory([]);
    setMovesCount(0);
    setTimerSeconds(0);
    setHintMove(null);
    setHintPathLength(null);
    setShowVictory(false);
    setIsTimerRunning(true);
    setScreen('playing');
  }, []);

  // Handle slide move
  const handleMove = useCallback((move: SlideMove) => {
    setGrid((prevGrid) => {
      const nextGrid = applyMove(prevGrid, move);
      const nextMovesCount = movesCount + 1;

      // Update history
      setHistory((prev) => [
        ...prev,
        {
          move,
          gridBefore: cloneGrid(prevGrid),
          timestamp: Date.now(),
        },
      ]);
      setMovesCount(nextMovesCount);

      // Invalidate existing hint move on user interaction
      setHintMove(null);
      setHintPathLength(null);

      // Check win condition
      const won = isWinningState(
        nextGrid,
        currentLevel.targetGrid,
        currentLevel.type,
        currentLevel.constraint
      );

      if (won) {
        setIsTimerRunning(false);
        const starsEarned = calculateStars(
          nextMovesCount,
          currentLevel.parMoves,
          currentLevel.maxMoves
        );

        setLastWinStats({
          stars: starsEarned,
          moves: nextMovesCount,
          time: timerSeconds,
        });

        // Save progress
        setProgress((prev) => {
          const prevLvl = prev[currentLevel.id] || {
            levelId: currentLevel.id,
            unlocked: true,
            completed: false,
            stars: 0,
            bestMoves: 999,
            bestTimeSeconds: 9999,
          };
          const updated = {
            ...prev,
            [currentLevel.id]: {
              ...prevLvl,
              completed: true,
              stars: Math.max(prevLvl.stars, starsEarned),
              bestMoves: Math.min(prevLvl.bestMoves, nextMovesCount),
              bestTimeSeconds: Math.min(prevLvl.bestTimeSeconds, timerSeconds),
            },
          };
          try {
            localStorage.setItem('cube_code_progress', JSON.stringify(updated));
          } catch {}
          return updated;
        });

        sound.playVictory();
        setShowVictory(true);
      }

      return nextGrid;
    });
  }, [movesCount, currentLevel, timerSeconds]);

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || showVictory) return;
    const last = history[history.length - 1];
    setGrid(cloneGrid(last.gridBefore));
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setMovesCount((prev) => Math.max(0, prev - 1));
    setHintMove(null);
    setHintPathLength(null);
  }, [history, showVictory]);

  // Reset current level
  const handleReset = useCallback(() => {
    setGrid(cloneGrid(currentLevel.initialGrid));
    setHistory([]);
    setMovesCount(0);
    setTimerSeconds(0);
    setHintMove(null);
    setHintPathLength(null);
    setShowVictory(false);
    setIsTimerRunning(true);
  }, [currentLevel]);

  // Compute optimal hint via BFS
  const handleHint = useCallback(() => {
    if (showVictory || isCalculatingHint) return;
    setIsCalculatingHint(true);

    // Compute BFS asynchronously to prevent UI hitching
    setTimeout(() => {
      const solution = solveBFS(
        grid,
        currentLevel.targetGrid,
        currentLevel.type,
        currentLevel.constraint,
        8
      );

      setIsCalculatingHint(false);
      if (solution && solution.length > 0) {
        setHintMove(solution[0]);
        setHintPathLength(solution.length);
      } else {
        setHintMove(null);
        setHintPathLength(null);
      }
    }, 10);
  }, [grid, currentLevel, showVictory, isCalculatingHint]);

  // Apply one optimal step automatically
  const handleAutoStep = useCallback(() => {
    if (hintMove) {
      handleMove(hintMove);
    }
  }, [hintMove, handleMove]);

  // Next level handler
  const handleNextLevel = useCallback(() => {
    setShowVictory(false);
    const nextIdx = currentLevelIndex + 1;
    if (nextIdx < LEVELS.length) {
      setCurrentLevelIndex(nextIdx);
      loadLevel(LEVELS[nextIdx]);
    } else {
      // Loop to procedural or level selector
      setShowLevelSelect(true);
    }
  }, [currentLevelIndex, loadLevel]);

  // Procedural puzzle generator
  const handleGenerateRandom = useCallback(() => {
    const procedural = generateProceduralLevel();
    loadLevel(procedural);
  }, [loadLevel]);

  // Toggle colorblind mode
  const handleToggleColorblind = useCallback(() => {
    setColorblindMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cube_code_colorblind', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Toggle sound mute
  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleHint();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (showVictory) setShowVictory(false);
        else if (showGDD) setShowGDD(false);
        else if (showHelp) setShowHelp(false);
        else if (showLevelSelect) setShowLevelSelect(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleReset, handleHint, handleToggleMute, showVictory, showGDD, showHelp, showLevelSelect]);

  // Render Title Screen
  if (screen === 'title') {
    return (
      <>
        <TitleScreen
          onStartGame={() => {
            setScreen('playing');
            setIsTimerRunning(true);
          }}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenGDD={() => setShowGDD(true)}
          totalStars={totalStars}
        />

        {showLevelSelect && (
          <LevelSelectModal
            levels={LEVELS}
            currentLevelId={currentLevel.id}
            progress={progress}
            onSelectLevel={(lvl) => {
              const idx = LEVELS.findIndex((l) => l.id === lvl.id);
              if (idx !== -1) setCurrentLevelIndex(idx);
              loadLevel(lvl);
            }}
            onGenerateRandom={handleGenerateRandom}
            onClose={() => setShowLevelSelect(false)}
          />
        )}

        {showGDD && <GDDModal onClose={() => setShowGDD(false)} />}
      </>
    );
  }

  // Render Playing Screen
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 bg-slate-950 text-slate-100 select-none relative overflow-x-hidden font-sans"
      data-testid="playing-screen"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <Header
        currentLevelNumber={currentLevel.number}
        totalLevels={LEVELS.length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
        onOpenGDD={() => setShowGDD(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Top Miniature Goal Card & Star Target */}
      <div className="w-full flex justify-center z-10 mb-1">
        <TargetPreview
          targetGrid={currentLevel.targetGrid}
          level={currentLevel}
          currentMoves={movesCount}
          colorblindMode={colorblindMode}
        />
      </div>

      {/* Center 3x3 Main Interactive Board */}
      <div className="w-full flex justify-center z-10 my-auto">
        <Board
          grid={grid}
          onMove={handleMove}
          colorblindMode={colorblindMode}
          hintMove={hintMove}
          disabled={showVictory}
        />
      </div>

      {/* Footer Controls Toolbar */}
      <div className="w-full flex justify-center z-10 mt-1">
        <Controls
          movesCount={movesCount}
          maxMoves={currentLevel.maxMoves}
          parMoves={currentLevel.parMoves}
          timerSeconds={timerSeconds}
          canUndo={history.length > 0}
          onUndo={handleUndo}
          onReset={handleReset}
          onHint={handleHint}
          onAutoStep={handleAutoStep}
          hintMove={hintMove}
          hintPathLength={hintPathLength}
          isCalculatingHint={isCalculatingHint}
          colorblindMode={colorblindMode}
          onToggleColorblind={handleToggleColorblind}
          disabled={showVictory}
        />
      </div>

      {/* Modals */}
      {showVictory && (
        <VictoryModal
          stars={lastWinStats.stars}
          moves={lastWinStats.moves}
          parMoves={currentLevel.parMoves}
          timeSeconds={lastWinStats.time}
          hasNextLevel={currentLevelIndex + 1 < LEVELS.length}
          onNextLevel={handleNextLevel}
          onReplay={handleReset}
          onLevelSelect={() => {
            setShowVictory(false);
            setShowLevelSelect(true);
          }}
        />
      )}

      {showLevelSelect && (
        <LevelSelectModal
          levels={LEVELS}
          currentLevelId={currentLevel.id}
          progress={progress}
          onSelectLevel={(lvl) => {
            const idx = LEVELS.findIndex((l) => l.id === lvl.id);
            if (idx !== -1) setCurrentLevelIndex(idx);
            loadLevel(lvl);
          }}
          onGenerateRandom={handleGenerateRandom}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {showGDD && <GDDModal onClose={() => setShowGDD(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
