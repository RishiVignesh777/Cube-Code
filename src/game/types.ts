/**
 * Cube Code - Data Model and State Representation
 */

export type TileColor = 'blue' | 'green' | 'amber' | 'slate' | 'rose' | 'violet';

export type SymbolShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'cross';

export interface Tile {
  id: number;              // Unique persistent identity across slides
  color: TileColor;        // Primary visual color
  numberVal?: number;      // 1 to 9 for sequence/numeric puzzles
  symbol?: SymbolShape;    // Overlaid shape for accessibility / colorblind mode
}

export type Grid3x3 = [
  [Tile, Tile, Tile],
  [Tile, Tile, Tile],
  [Tile, Tile, Tile]
];

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface SlideMove {
  type: 'row' | 'col';
  index: 0 | 1 | 2;
  direction: SlideDirection;
}

export type ConstraintType = 
  | 'none'
  | 'no_adjacent_same_color'
  | 'corners_matching'
  | 'center_match_all'
  | 'row_unique_colors'
  | 'col_unique_colors';

export type PuzzleType = 'pattern' | 'sequence' | 'logic';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface LevelDefinition {
  id: string;
  number: number;
  title: string;
  category: DifficultyLevel;
  type: PuzzleType;
  description: string;
  hintTip: string;
  targetGrid: Grid3x3;
  initialGrid: Grid3x3;
  parMoves: number;         // 3-star baseline
  maxMoves: number;         // Move budget / failure limit
  constraint: ConstraintType;
}

export interface MoveHistoryRecord {
  move: SlideMove;
  gridBefore: Grid3x3;
  timestamp: number;
}

export interface PlayerLevelProgress {
  levelId: string;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestMoves: number;
  bestTimeSeconds: number;
}

export type GameScreen = 'title' | 'level_select' | 'playing' | 'paused' | 'gdd';
