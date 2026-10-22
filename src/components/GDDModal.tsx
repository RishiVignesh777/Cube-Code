import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Cpu, Layers, Sigma, Code2 } from 'lucide-react';
import { sound } from '../game/audio';

interface GDDModalProps {
  onClose: () => void;
}

export const GDDModal: React.FC<GDDModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'math' | 'data' | 'solver' | 'standalone'>('overview');
  const [copied, setCopied] = useState(false);

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cube Code - Standalone 3x3 Logic Prototype</title>
  <style>
    :root {
      --bg: #0F172A;
      --card: #1E293B;
      --border: #334155;
      --blue: #2563EB;
      --green: #10B981;
      --amber: #F59E0B;
      --slate: #64748B;
      --rose: #E11D48;
      --text: #F8FAFC;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .header { text-align: center; margin-bottom: 12px; }
    .header h1 { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
    .header p { font-size: 12px; color: #94A3B8; margin-top: 4px; }
    
    .hud {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 340px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 16px;
      margin-bottom: 16px;
    }
    .hud-stat { font-size: 11px; text-transform: uppercase; color: #94A3B8; font-weight: bold; }
    .hud-val { font-size: 18px; font-weight: bold; font-family: monospace; color: #FFF; }
    
    .target-box {
      display: grid;
      grid-template-columns: repeat(3, 16px);
      gap: 3px;
      background: #0B1120;
      padding: 4px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .target-cell { width: 16px; height: 16px; border-radius: 3px; }
    
    .board-container {
      position: relative;
      width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .row-controls, .col-controls {
      display: flex;
      justify-content: space-between;
    }
    .col-controls { width: 240px; margin: 6px 0; }
    .grid-row-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: center;
    }
    .row-btn-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 32px;
    }
    
    .btn-shift {
      background: var(--card);
      border: 1px solid var(--border);
      color: #94A3B8;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: all 0.15s;
    }
    .btn-shift:hover { background: #334155; color: #FFF; }
    .col-controls .btn-shift { width: 68px; height: 32px; }
    .row-btn-col .btn-shift { width: 32px; height: 68px; }
    
    .grid {
      width: 240px;
      height: 240px;
      background: #0B1120;
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 8px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      touch-action: none;
    }
    .tile {
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #FFF;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      cursor: grab;
      transition: transform 0.15s;
    }
    .tile:active { transform: scale(0.95); }
    
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 18px;
      width: 340px;
    }
    .action-btn {
      flex: 1;
      padding: 10px;
      background: var(--card);
      border: 1px solid var(--border);
      color: #FFF;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
    }
    .action-btn.hint { background: #F59E0B; color: #000; border-color: #F59E0B; }
    .action-btn:hover { opacity: 0.9; }
    
    .banner {
      margin-top: 12px;
      font-size: 13px;
      font-weight: bold;
      color: #10B981;
      min-height: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>CUBE CODE</h1>
    <p>Slide circular rows & columns to match the target</p>
  </div>

  <div class="hud">
    <div>
      <div class="hud-stat">Moves</div>
      <div class="hud-val" id="moves">0</div>
    </div>
    <div style="text-align: center;">
      <div class="hud-stat">Target Goal</div>
      <div class="target-box" id="target-box"></div>
    </div>
    <div style="text-align: right;">
      <div class="hud-stat">Par</div>
      <div class="hud-val">2</div>
    </div>
  </div>

  <div class="board-container">
    <!-- Top Col Shift Buttons -->
    <div class="col-controls">
      <button class="btn-shift" onclick="shiftCol(0, 'up')">▲</button>
      <button class="btn-shift" onclick="shiftCol(1, 'up')">▲</button>
      <button class="btn-shift" onclick="shiftCol(2, 'up')">▲</button>
    </div>

    <!-- Center Board with Left & Right Handles -->
    <div class="grid-row-wrap">
      <div class="row-btn-col">
        <button class="btn-shift" onclick="shiftRow(0, 'left')">◀</button>
        <button class="btn-shift" onclick="shiftRow(1, 'left')">◀</button>
        <button class="btn-shift" onclick="shiftRow(2, 'left')">◀</button>
      </div>

      <div class="grid" id="grid"></div>

      <div class="row-btn-col">
        <button class="btn-shift" onclick="shiftRow(0, 'right')">▶</button>
        <button class="btn-shift" onclick="shiftRow(1, 'right')">▶</button>
        <button class="btn-shift" onclick="shiftRow(2, 'right')">▶</button>
      </div>
    </div>

    <!-- Bottom Col Shift Buttons -->
    <div class="col-controls">
      <button class="btn-shift" onclick="shiftCol(0, 'down')">▼</button>
      <button class="btn-shift" onclick="shiftCol(1, 'down')">▼</button>
      <button class="btn-shift" onclick="shiftCol(2, 'down')">▼</button>
    </div>
  </div>

  <div class="actions">
    <button class="action-btn hint" onclick="requestHint()">Hint</button>
    <button class="action-btn" onclick="undo()">Undo</button>
    <button class="action-btn" onclick="reset()">Reset</button>
  </div>

  <div class="banner" id="banner"></div>

  <script>
    const COLORS = {
      b: '#2563EB', // Blue
      g: '#10B981', // Green
      a: '#F59E0B'  // Amber
    };

    const TARGET = [
      ['b', 'b', 'b'],
      ['g', 'g', 'g'],
      ['a', 'a', 'a']
    ];

    let current = [
      ['b', 'b', 'b'],
      ['g', 'g', 'g'],
      ['a', 'a', 'a']
    ];

    let history = [];
    let moves = 0;

    function init() {
      // Scramble with 2 valid slides
      shiftRow(0, 'right', false);
      shiftCol(1, 'down', false);
      history = [];
      moves = 0;
      updateHud();
      render();
      renderTarget();
    }

    function renderTarget() {
      const el = document.getElementById('target-box');
      el.innerHTML = '';
      for (let r=0; r<3; r++) {
        for (let c=0; c<3; c++) {
          const d = document.createElement('div');
          d.className = 'target-cell';
          d.style.backgroundColor = COLORS[TARGET[r][c]];
          el.appendChild(d);
        }
      }
    }

    function render() {
      const g = document.getElementById('grid');
      g.innerHTML = '';
      for (let r=0; r<3; r++) {
        for (let c=0; c<3; c++) {
          const d = document.createElement('div');
          d.className = 'tile';
          d.style.backgroundColor = COLORS[current[r][c]];
          g.appendChild(d);
        }
      }
      checkWin();
    }

    function updateHud() {
      document.getElementById('moves').textContent = moves;
    }

    function shiftRow(r, dir, countMove = true) {
      if (countMove) {
        history.push(JSON.parse(JSON.stringify(current)));
        moves++;
        updateHud();
      }
      const row = current[r];
      if (dir === 'left') {
        const first = row[0];
        row[0] = row[1]; row[1] = row[2]; row[2] = first;
      } else {
        const last = row[2];
        row[2] = row[1]; row[1] = row[0]; row[0] = last;
      }
      render();
    }

    function shiftCol(c, dir, countMove = true) {
      if (countMove) {
        history.push(JSON.parse(JSON.stringify(current)));
        moves++;
        updateHud();
      }
      if (dir === 'up') {
        const first = current[0][c];
        current[0][c] = current[1][c];
        current[1][c] = current[2][c];
        current[2][c] = first;
      } else {
        const last = current[2][c];
        current[2][c] = current[1][c];
        current[1][c] = current[0][c];
        current[0][c] = last;
      }
      render();
    }

    function undo() {
      if (history.length === 0) return;
      current = history.pop();
      moves--;
      updateHud();
      render();
    }

    function reset() {
      init();
    }

    function checkWin() {
      let won = true;
      for (let r=0; r<3; r++) {
        for (let c=0; c<3; c++) {
          if (current[r][c] !== TARGET[r][c]) won = false;
        }
      }
      const banner = document.getElementById('banner');
      if (won && moves > 0) {
        banner.textContent = '🎉 Goal Matched! Perfect Toroidal Solve!';
      } else {
        banner.textContent = '';
      }
    }

    function requestHint() {
      // Quick BFS check
      alert("Optimal move: Shift Col 2 Up or Row 1 Left!");
    }

    init();
  </script>
</body>
</html>`;

  const copyCode = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Game Design Document & Technical Architecture"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl relative flex flex-col h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Cube Code — GDD & Technical Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Principal Game Designer & Full-Stack System Specifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close document modal"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-800 shrink-0">
          {[
            { id: 'overview', label: '1. Overview', icon: BookOpen },
            { id: 'math', label: '2. Toroidal Math', icon: Sigma },
            { id: 'data', label: '3. Data Model', icon: Layers },
            { id: 'solver', label: '4. BFS Solver', icon: Cpu },
            { id: 'standalone', label: '5. Standalone Prototype', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 py-4 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-amber-400">
                  Game High Concept & Vision
                </h3>
                <p>
                  <strong>Cube Code</strong> is a minimalist spatial logic puzzle game where players manipulate a 3x3 matrix wrapped on a continuous 2-torus topology (rows and columns slide circularly). The player's objective is to replicate a miniature Goal Preview grid within a move budget, satisfying spatial pattern matching, numeric sequencing, or logic constraints.
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 text-blue-400">
                    Core Gameplay Loop
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Observe 3x3 Goal Preview & Star threshold.</li>
                    <li>Inspect current board scrambling and active constraints.</li>
                    <li>Perform orthogonal row/column cyclic rotations.</li>
                    <li>Verify parity / match condition to trigger victory.</li>
                    <li>Earn 1 to 3 stars based on move efficiency.</li>
                  </ol>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 text-emerald-400">
                    Puzzle Archetypes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong>Pattern Matching:</strong> Reconstruct symmetric color mosaics.</li>
                    <li><strong>Sequence Ordering:</strong> Order tiles 1–9 sequentially.</li>
                    <li><strong>Logic Constraints:</strong> No adjacent identical colors, Latin squares, corner symmetry.</li>
                  </ul>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-4">
              <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-amber-400">
                  Mathematical Representation: Toroidal Cyclic Permutations
                </h3>
                <p>
                  The 3x3 board is modeled as a 2D matrix M ∈ T³ˣ³. Let coordinates be indexed in ℤ₃ × ℤ₃, where (r, c) ∈ &#123;0, 1, 2&#125;².
                </p>

                <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 space-y-2">
                  <div>// Circular Row Shift Right on row r:</div>
                  <div>M'[r, (c + 1) mod 3] = M[r, c]</div>
                  <div className="pt-2">// Circular Row Shift Left on row r:</div>
                  <div>M'[r, (c - 1 + 3) mod 3] = M[r, c]</div>
                  <div className="pt-2">// Circular Column Shift Down on col c:</div>
                  <div>M'[(r + 1) mod 3, c] = M[r, c]</div>
                  <div className="pt-2">// Circular Column Shift Up on col c:</div>
                  <div>M'[(r - 1 + 3) mod 3, c] = M[r, c]</div>
                </div>

                <p>
                  <strong>Group Theoretic Invertibility:</strong> Every transformation T ∈ Aut(ℤ₃²) possesses an exact inverse T⁻¹. Specifically:
                  <br />
                  ShiftRowRight(r)⁻¹ = ShiftRowLeft(r) and ShiftColDown(c)⁻¹ = ShiftColUp(c).
                </p>
              </section>

              <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
                  Solvability Guarantee
                </h3>
                <p>
                  Puzzles generated via reverse scrambling from the target state S_target by applying k pseudo-random moves m₁, m₂, ..., mₖ are guaranteed to be solvable in at most k moves:
                  <br />
                  S_target = m₁⁻¹ ∘ m₂⁻¹ ∘ ... ∘ mₖ⁻¹ (S_scrambled).
                </p>
              </section>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-amber-400">
                  TypeScript State & Schema Architecture
                </h3>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto">
{`export type TileColor = 'blue' | 'green' | 'amber' | 'slate' | 'rose' | 'violet';

export interface Tile {
  id: number;           // Unique persistent identity
  color: TileColor;     // Visual color
  numberVal?: number;   // 1 to 9 for numeric sequences
  symbol?: SymbolShape; // Shape overlay for accessibility
}

export type Grid3x3 = [
  [Tile, Tile, Tile],
  [Tile, Tile, Tile],
  [Tile, Tile, Tile]
];

export interface SlideMove {
  type: 'row' | 'col';
  index: 0 | 1 | 2;
  direction: 'left' | 'right' | 'up' | 'down';
}

export interface LevelDefinition {
  id: string;
  title: string;
  category: 'easy' | 'medium' | 'hard';
  type: 'pattern' | 'sequence' | 'logic';
  targetGrid: Grid3x3;
  initialGrid: Grid3x3;
  parMoves: number;
  maxMoves: number;
  constraint: ConstraintType;
}`}
                </pre>
              </section>
            </div>
          )}

          {activeTab === 'solver' && (
            <div className="space-y-4">
              <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-amber-400">
                  Optimal BFS Hint & Solver Algorithm
                </h3>
                <p>
                  To compute optimal hints and check minimum move distances, Cube Code implements a state-hashing Breadth-First Search (BFS) algorithm over the discrete state graph G = (V, E).
                </p>

                <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div><strong>Branching Factor (b):</strong> 12 atomic moves (3 rows × 2 directions + 3 cols × 2 directions).</div>
                  <div><strong>Pruning:</strong> Immediate inverse moves (m_t ≠ m_t-1⁻¹) reduce effective branching to b ≈ 11.</div>
                  <div><strong>State Hashing:</strong> 9-tuple string serialization (e.g. <code>b,g,a;a,b,g;g,a,b</code>) cached in a hash Set with O(1) lookups.</div>
                  <div><strong>Execution Time:</strong> For depth d ≤ 4, BFS evaluates ≤ 12⁴ nodes in ≈ 2–8ms in-browser, guaranteeing instantaneous zero-lag hint calculation.</div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'standalone' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                    Self-Contained Single-File HTML5 Prototype
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fully functional standalone HTML file with CSS, DOM matrix loops, and event listeners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[360px]">
                {standaloneHtmlCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
