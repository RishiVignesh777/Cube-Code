/**
 * Cube Code - Mathematical & Algorithmic Core Logic
 *
 * Implements circular toroidal sliding for 3x3 matrices, state hashing,
 * constraint verification, and optimal Breadth-First Search (BFS) shortest-path solving.
 */

import {
  Grid3x3,
  SlideMove,
  Tile,
  ConstraintType,
  PuzzleType,
  TileColor,
  SymbolShape,
} from './types';

/**
 * Deep clones a 3x3 grid to guarantee immutability.
 */
export function cloneGrid(grid: Grid3x3): Grid3x3 {
  return [
    [{ ...grid[0][0] }, { ...grid[0][1] }, { ...grid[0][2] }],
    [{ ...grid[1][0] }, { ...grid[1][1] }, { ...grid[1][2] }],
    [{ ...grid[2][0] }, { ...grid[2][1] }, { ...grid[2][2] }],
  ];
}

/**
 * Applies a circular row shift to the left:
 * (c - 1 + 3) mod 3 -> index 0 gets 1, index 1 gets 2, index 2 gets 0.
 */
export function slideRowLeft(grid: Grid3x3, rowIdx: 0 | 1 | 2): Grid3x3 {
  const next = cloneGrid(grid);
  const r = next[rowIdx];
  const first = r[0];
  r[0] = r[1];
  r[1] = r[2];
  r[2] = first;
  return next;
}

/**
 * Applies a circular row shift to the right:
 * (c + 1) mod 3 -> index 0 gets 2, index 1 gets 0, index 2 gets 1.
 */
export function slideRowRight(grid: Grid3x3, rowIdx: 0 | 1 | 2): Grid3x3 {
  const next = cloneGrid(grid);
  const r = next[rowIdx];
  const last = r[2];
  r[2] = r[1];
  r[1] = r[0];
  r[0] = last;
  return next;
}

/**
 * Applies a circular column shift upward:
 * (r - 1 + 3) mod 3 -> row 0 gets 1, row 1 gets 2, row 2 gets 0.
 */
export function slideColUp(grid: Grid3x3, colIdx: 0 | 1 | 2): Grid3x3 {
  const next = cloneGrid(grid);
  const first = next[0][colIdx];
  next[0][colIdx] = next[1][colIdx];
  next[1][colIdx] = next[2][colIdx];
  next[2][colIdx] = first;
  return next;
}

/**
 * Applies a circular column shift downward:
 * (r + 1) mod 3 -> row 0 gets 2, row 1 gets 0, row 2 gets 1.
 */
export function slideColDown(grid: Grid3x3, colIdx: 0 | 1 | 2): Grid3x3 {
  const next = cloneGrid(grid);
  const last = next[2][colIdx];
  next[2][colIdx] = next[1][colIdx];
  next[1][colIdx] = next[0][colIdx];
  next[0][colIdx] = last;
  return next;
}

/**
 * Dispatches a move to the appropriate sliding transform.
 */
export function applyMove(grid: Grid3x3, move: SlideMove): Grid3x3 {
  if (move.type === 'row') {
    return move.direction === 'left'
      ? slideRowLeft(grid, move.index)
      : slideRowRight(grid, move.index);
  } else {
    return move.direction === 'up'
      ? slideColUp(grid, move.index)
      : slideColDown(grid, move.index);
  }
}

/**
 * Computes the inverse move for undo operations.
 */
export function getInverseMove(move: SlideMove): SlideMove {
  if (move.type === 'row') {
    return {
      type: 'row',
      index: move.index,
      direction: move.direction === 'left' ? 'right' : 'left',
    };
  } else {
    return {
      type: 'col',
      index: move.index,
      direction: move.direction === 'up' ? 'down' : 'up',
    };
  }
}

/**
 * Checks if two moves cancel each other out.
 */
export function isInverseMove(a: SlideMove, b: SlideMove): boolean {
  return (
    a.type === b.type &&
    a.index === b.index &&
    ((a.direction === 'left' && b.direction === 'right') ||
      (a.direction === 'right' && b.direction === 'left') ||
      (a.direction === 'up' && b.direction === 'down') ||
      (a.direction === 'down' && b.direction === 'up'))
  );
}

/**
 * Serializes a 3x3 board state into a compact string hash for graph search.
 */
export function serializeGrid(grid: Grid3x3, puzzleType: PuzzleType): string {
  if (puzzleType === 'sequence') {
    return grid
      .map((row) => row.map((t) => t.numberVal ?? t.id).join(','))
      .join(';');
  }
  // Pattern and logic matching primarily compare tile color
  return grid.map((row) => row.map((t) => t.color).join(',')).join(';');
}

/**
 * Validates whether the current grid satisfies logic constraints.
 */
export function checkConstraints(grid: Grid3x3, constraint: ConstraintType): boolean {
  if (constraint === 'none') return true;

  if (constraint === 'no_adjacent_same_color') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const color = grid[r][c].color;
        // Check horizontal neighbor
        if (c < 2 && grid[r][c + 1].color === color) return false;
        // Check vertical neighbor
        if (r < 2 && grid[r + 1][c].color === color) return false;
      }
    }
    return true;
  }

  if (constraint === 'corners_matching') {
    const c00 = grid[0][0].color;
    return (
      grid[0][2].color === c00 &&
      grid[2][0].color === c00 &&
      grid[2][2].color === c00
    );
  }

  if (constraint === 'center_match_all') {
    const center = grid[1][1].color;
    // Cross matches center: (0,1), (1,0), (1,2), (2,1)
    return (
      grid[0][1].color === center &&
      grid[1][0].color === center &&
      grid[1][2].color === center &&
      grid[2][1].color === center
    );
  }

  if (constraint === 'row_unique_colors') {
    for (let r = 0; r < 3; r++) {
      const colors = new Set([grid[r][0].color, grid[r][1].color, grid[r][2].color]);
      if (colors.size !== 3) return false;
    }
    return true;
  }

  if (constraint === 'col_unique_colors') {
    for (let c = 0; c < 3; c++) {
      const colors = new Set([grid[0][c].color, grid[1][c].color, grid[2][c].color]);
      if (colors.size !== 3) return false;
    }
    return true;
  }

  return true;
}

/**
 * Checks board equality against the goal target and constraint satisfaction.
 */
export function isWinningState(
  current: Grid3x3,
  target: Grid3x3,
  puzzleType: PuzzleType,
  constraint: ConstraintType = 'none'
): boolean {
  if (!checkConstraints(current, constraint)) {
    return false;
  }

  if (puzzleType === 'sequence') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (current[r][c].numberVal !== target[r][c].numberVal) {
          return false;
        }
      }
    }
    return true;
  }

  // Pattern or Logic
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (current[r][c].color !== target[r][c].color) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The 12 possible atomic move operations on a 3x3 grid.
 */
export const ALL_MOVES: SlideMove[] = [
  { type: 'row', index: 0, direction: 'left' },
  { type: 'row', index: 0, direction: 'right' },
  { type: 'row', index: 1, direction: 'left' },
  { type: 'row', index: 1, direction: 'right' },
  { type: 'row', index: 2, direction: 'left' },
  { type: 'row', index: 2, direction: 'right' },
  { type: 'col', index: 0, direction: 'up' },
  { type: 'col', index: 0, direction: 'down' },
  { type: 'col', index: 1, direction: 'up' },
  { type: 'col', index: 1, direction: 'down' },
  { type: 'col', index: 2, direction: 'up' },
  { type: 'col', index: 2, direction: 'down' },
];

/**
 * Optimal Breadth-First Search (BFS) Solver for 3x3 Cube Code puzzles.
 *
 * Guaranteed to find the minimum-step solution sequence if one exists
 * within maxDepth. Employs state hashing and immediate branch pruning
 * (avoiding inverse moves).
 */
export function solveBFS(
  initialGrid: Grid3x3,
  targetGrid: Grid3x3,
  puzzleType: PuzzleType,
  constraint: ConstraintType = 'none',
  maxDepth = 10
): SlideMove[] | null {
  if (isWinningState(initialGrid, targetGrid, puzzleType, constraint)) {
    return [];
  }

  const initialHash = serializeGrid(initialGrid, puzzleType);
  const visited = new Set<string>();
  visited.add(initialHash);

  interface QueueNode {
    grid: Grid3x3;
    path: SlideMove[];
  }

  const queue: QueueNode[] = [{ grid: initialGrid, path: [] }];

  while (queue.length > 0) {
    const { grid: currentGrid, path } = queue.shift()!;

    if (path.length >= maxDepth) {
      continue;
    }

    const lastMove = path.length > 0 ? path[path.length - 1] : null;

    for (const move of ALL_MOVES) {
      // Prune immediate inverse move (e.g. left then right on same row)
      if (lastMove && isInverseMove(lastMove, move)) {
        continue;
      }

      const nextGrid = applyMove(currentGrid, move);

      if (isWinningState(nextGrid, targetGrid, puzzleType, constraint)) {
        return [...path, move];
      }

      const hash = serializeGrid(nextGrid, puzzleType);
      if (!visited.has(hash)) {
        visited.add(hash);
        queue.push({
          grid: nextGrid,
          path: [...path, move],
        });
      }
    }
  }

  return null;
}

/**
 * Calculates 1, 2, or 3 star rating based on move efficiency.
 */
export function calculateStars(movesTaken: number, parMoves: number, maxMoves: number): number {
  if (movesTaken > maxMoves) return 0;
  if (movesTaken <= parMoves) return 3;
  if (movesTaken <= parMoves + 2) return 2;
  return 1;
}

/**
 * Creates a standard tile.
 */
export function createTile(
  id: number,
  color: TileColor,
  numberVal?: number,
  symbol?: SymbolShape
): Tile {
  return { id, color, numberVal, symbol };
}

/**
 * Procedural scrambler: applies `numSteps` valid sliding operations
 * starting from a target grid. This mathematically guarantees the generated
 * puzzle is 100% solvable within `numSteps` moves.
 */
export function scrambleGrid(
  targetGrid: Grid3x3,
  numSteps: number
): { scrambled: Grid3x3; moves: SlideMove[] } {
  let current = cloneGrid(targetGrid);
  const appliedMoves: SlideMove[] = [];

  for (let i = 0; i < numSteps; i++) {
    // Pick a random move that is not the inverse of the last move
    let move: SlideMove;
    const lastMove = appliedMoves.length > 0 ? appliedMoves[appliedMoves.length - 1] : null;
    let attempts = 0;
    do {
      move = ALL_MOVES[Math.floor(Math.random() * ALL_MOVES.length)];
      attempts++;
    } while (lastMove && isInverseMove(lastMove, move) && attempts < 20);

    current = applyMove(current, move);
    appliedMoves.push(move);
  }

  return { scrambled: current, moves: appliedMoves };
}
