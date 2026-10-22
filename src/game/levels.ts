/**
 * Cube Code - Pre-designed Level Catalog & Procedural Puzzle Generator
 */

import { LevelDefinition, Grid3x3, Tile, TileColor, SymbolShape } from './types';
import { applyMove, cloneGrid, scrambleGrid, createTile } from './logic';

// Color & Symbol Mapping for accessibility
export const COLOR_SYMBOL_MAP: Record<TileColor, SymbolShape> = {
  blue: 'circle',
  green: 'square',
  amber: 'triangle',
  slate: 'diamond',
  rose: 'star',
  violet: 'cross',
};

export const COLOR_HEX_MAP: Record<TileColor, string> = {
  blue: '#2563EB',   // Azure Blue
  green: '#10B981',  // Emerald Green
  amber: '#F59E0B',  // Amber Orange
  slate: '#64748B',  // Slate Gray
  rose: '#E11D48',   // Rose Crimson
  violet: '#8B5CF6', // Violet
};

function makeTile(id: number, color: TileColor, numberVal?: number): Tile {
  return createTile(id, color, numberVal, COLOR_SYMBOL_MAP[color]);
}

// ----------------------------------------------------
// Level Definitions
// ----------------------------------------------------

export const LEVELS: LevelDefinition[] = [
  // ================= EASY LEVELS =================
  {
    id: 'easy-1',
    number: 1,
    title: 'First Alignment',
    category: 'easy',
    type: 'pattern',
    description: 'Slide column 0 up and column 2 down to align the horizontal color stripes.',
    hintTip: 'Use column shifts to return the blue tiles to the top row.',
    parMoves: 2,
    maxMoves: 6,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'blue'), makeTile(3, 'blue')],
      [makeTile(4, 'green'), makeTile(5, 'green'), makeTile(6, 'green')],
      [makeTile(7, 'amber'), makeTile(8, 'amber'), makeTile(9, 'amber')],
    ],
    // Scrambled via Col 0 Down, Col 2 Up (2 moves from target)
    initialGrid: [
      [makeTile(7, 'amber'), makeTile(2, 'blue'), makeTile(6, 'green')],
      [makeTile(1, 'blue'), makeTile(5, 'green'), makeTile(9, 'amber')],
      [makeTile(4, 'green'), makeTile(8, 'amber'), makeTile(3, 'blue')],
    ],
  },
  {
    id: 'easy-2',
    number: 2,
    title: 'Color Columns',
    category: 'easy',
    type: 'pattern',
    description: 'Rows can be slid horizontally to restore vertical color columns.',
    hintTip: 'Slide rows 0 and 2 horizontally to match the column pattern.',
    parMoves: 2,
    maxMoves: 7,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'green'), makeTile(3, 'amber')],
      [makeTile(4, 'blue'), makeTile(5, 'green'), makeTile(6, 'amber')],
      [makeTile(7, 'blue'), makeTile(8, 'green'), makeTile(9, 'amber')],
    ],
    // Scrambled via Row 0 Right, Row 2 Left (2 moves from target)
    initialGrid: [
      [makeTile(3, 'amber'), makeTile(1, 'blue'), makeTile(2, 'green')],
      [makeTile(4, 'blue'), makeTile(5, 'green'), makeTile(6, 'amber')],
      [makeTile(8, 'green'), makeTile(9, 'amber'), makeTile(7, 'blue')],
    ],
  },
  {
    id: 'easy-3',
    number: 3,
    title: 'Emerald Cross',
    category: 'easy',
    type: 'pattern',
    description: 'Recreate the emerald cross pattern centered on the board.',
    hintTip: 'Combine row and column shifts to gather the green tiles.',
    parMoves: 3,
    maxMoves: 8,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'slate'), makeTile(2, 'green'), makeTile(3, 'slate')],
      [makeTile(4, 'green'), makeTile(5, 'green'), makeTile(6, 'green')],
      [makeTile(7, 'slate'), makeTile(8, 'green'), makeTile(9, 'slate')],
    ],
    // Scrambled via Row 1 Right, Col 1 Down, Row 0 Left (3 moves from target)
    initialGrid: [
      [makeTile(2, 'green'), makeTile(3, 'slate'), makeTile(1, 'slate')],
      [makeTile(6, 'green'), makeTile(2, 'green'), makeTile(5, 'green')],
      [makeTile(7, 'slate'), makeTile(4, 'green'), makeTile(9, 'slate')],
    ],
  },
  {
    id: 'easy-4',
    number: 4,
    title: 'Tricolor Diagonal',
    category: 'easy',
    type: 'pattern',
    description: 'Match the stepped diagonal staircase across the 3x3 grid.',
    hintTip: 'Look at the positions of the amber tiles along the diagonal.',
    parMoves: 3,
    maxMoves: 9,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'amber'), makeTile(2, 'blue'), makeTile(3, 'green')],
      [makeTile(4, 'blue'), makeTile(5, 'amber'), makeTile(6, 'blue')],
      [makeTile(7, 'green'), makeTile(8, 'blue'), makeTile(9, 'amber')],
    ],
    // Scrambled via Row 0 Left, Col 0 Up, Row 2 Right (3 moves from target)
    initialGrid: [
      [makeTile(4, 'blue'), makeTile(3, 'green'), makeTile(1, 'amber')],
      [makeTile(7, 'green'), makeTile(5, 'amber'), makeTile(6, 'blue')],
      [makeTile(9, 'amber'), makeTile(2, 'blue'), makeTile(8, 'blue')],
    ],
  },

  // ================= MEDIUM LEVELS =================
  {
    id: 'med-1',
    number: 5,
    title: 'Order of Nine',
    category: 'medium',
    type: 'sequence',
    description: 'Reorder numbers 1 through 9 from top-left to bottom-right.',
    hintTip: 'First place 1, 2, 3 in the top row, then solve the remaining rows.',
    parMoves: 3,
    maxMoves: 10,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue', 1), makeTile(2, 'blue', 2), makeTile(3, 'blue', 3)],
      [makeTile(4, 'green', 4), makeTile(5, 'green', 5), makeTile(6, 'green', 6)],
      [makeTile(7, 'amber', 7), makeTile(8, 'amber', 8), makeTile(9, 'amber', 9)],
    ],
    initialGrid: [
      [makeTile(2, 'blue', 2), makeTile(3, 'blue', 3), makeTile(1, 'blue', 1)],
      [makeTile(4, 'green', 4), makeTile(5, 'green', 5), makeTile(6, 'green', 6)],
      [makeTile(8, 'amber', 8), makeTile(9, 'amber', 9), makeTile(7, 'amber', 7)],
    ],
  },
  {
    id: 'med-2',
    number: 6,
    title: 'Grid Inversion',
    category: 'medium',
    type: 'sequence',
    description: 'Rotate intersecting rows and columns to reverse number offsets.',
    hintTip: 'Shifting the middle column coordinates with both top and bottom rows.',
    parMoves: 4,
    maxMoves: 12,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'slate', 1), makeTile(2, 'slate', 2), makeTile(3, 'slate', 3)],
      [makeTile(4, 'rose', 4), makeTile(5, 'rose', 5), makeTile(6, 'rose', 6)],
      [makeTile(7, 'violet', 7), makeTile(8, 'violet', 8), makeTile(9, 'violet', 9)],
    ],
    initialGrid: [
      [makeTile(1, 'slate', 1), makeTile(5, 'rose', 5), makeTile(3, 'slate', 3)],
      [makeTile(4, 'rose', 4), makeTile(8, 'violet', 8), makeTile(6, 'rose', 6)],
      [makeTile(7, 'violet', 7), makeTile(2, 'slate', 2), makeTile(9, 'violet', 9)],
    ],
  },
  {
    id: 'med-3',
    number: 7,
    title: 'Checkerboard Matrix',
    category: 'medium',
    type: 'pattern',
    description: 'Reconstruct the two-tone alternating checkerboard.',
    hintTip: 'Rows 0 and 2 have identical color sequences in a checkerboard.',
    parMoves: 4,
    maxMoves: 12,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'amber'), makeTile(3, 'blue')],
      [makeTile(4, 'amber'), makeTile(5, 'blue'), makeTile(6, 'amber')],
      [makeTile(7, 'blue'), makeTile(8, 'amber'), makeTile(9, 'blue')],
    ],
    initialGrid: [
      [makeTile(2, 'amber'), makeTile(3, 'blue'), makeTile(1, 'blue')],
      [makeTile(5, 'blue'), makeTile(6, 'amber'), makeTile(4, 'amber')],
      [makeTile(7, 'blue'), makeTile(8, 'amber'), makeTile(9, 'blue')],
    ],
  },
  {
    id: 'med-4',
    number: 8,
    title: 'Frame and Core',
    category: 'medium',
    type: 'pattern',
    description: 'Surround an isolated Amber core with Azure and Green borders.',
    hintTip: 'Keep track of the center tile position as you slide columns.',
    parMoves: 4,
    maxMoves: 13,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'green'), makeTile(3, 'blue')],
      [makeTile(4, 'green'), makeTile(5, 'amber'), makeTile(6, 'green')],
      [makeTile(7, 'blue'), makeTile(8, 'green'), makeTile(9, 'blue')],
    ],
    initialGrid: [
      [makeTile(1, 'blue'), makeTile(5, 'amber'), makeTile(3, 'blue')],
      [makeTile(4, 'green'), makeTile(8, 'green'), makeTile(6, 'green')],
      [makeTile(7, 'blue'), makeTile(2, 'green'), makeTile(9, 'blue')],
    ],
  },

  // ================= HARD LEVELS =================
  {
    id: 'hard-1',
    number: 9,
    title: 'Logic: No Touching Blues',
    category: 'hard',
    type: 'logic',
    description: 'Constraint Rule: No two Blue tiles can touch orthogonally!',
    hintTip: 'Blue tiles must be separated by Green or Slate tiles in all 4 directions.',
    parMoves: 4,
    maxMoves: 14,
    constraint: 'no_adjacent_same_color',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'green'), makeTile(3, 'blue')],
      [makeTile(4, 'green'), makeTile(5, 'slate'), makeTile(6, 'green')],
      [makeTile(7, 'blue'), makeTile(8, 'green'), makeTile(9, 'blue')],
    ],
    initialGrid: [
      [makeTile(1, 'blue'), makeTile(3, 'blue'), makeTile(2, 'green')],
      [makeTile(6, 'green'), makeTile(5, 'slate'), makeTile(4, 'green')],
      [makeTile(8, 'green'), makeTile(7, 'blue'), makeTile(9, 'blue')],
    ],
  },
  {
    id: 'hard-2',
    number: 10,
    title: 'Logic: Sentry Corners',
    category: 'hard',
    type: 'logic',
    description: 'Constraint Rule: All four corners must match the Rose color.',
    hintTip: 'Rotate perimeter tiles until Rose tiles occupy (0,0), (0,2), (2,0), (2,2).',
    parMoves: 5,
    maxMoves: 15,
    constraint: 'corners_matching',
    targetGrid: [
      [makeTile(1, 'rose'), makeTile(2, 'slate'), makeTile(3, 'rose')],
      [makeTile(4, 'slate'), makeTile(5, 'blue'), makeTile(6, 'slate')],
      [makeTile(7, 'rose'), makeTile(8, 'slate'), makeTile(9, 'rose')],
    ],
    initialGrid: [
      [makeTile(2, 'slate'), makeTile(3, 'rose'), makeTile(1, 'rose')],
      [makeTile(4, 'slate'), makeTile(5, 'blue'), makeTile(6, 'slate')],
      [makeTile(7, 'rose'), makeTile(9, 'rose'), makeTile(8, 'slate')],
    ],
  },
  {
    id: 'hard-3',
    number: 11,
    title: 'Grand Sequence Shift',
    category: 'hard',
    type: 'sequence',
    description: 'Deep scramble of sequence 1 through 9. Minimize every single slide.',
    hintTip: 'Focus on corner anchors (1, 3, 7, 9) before resolving edges.',
    parMoves: 5,
    maxMoves: 16,
    constraint: 'none',
    targetGrid: [
      [makeTile(1, 'blue', 1), makeTile(2, 'blue', 2), makeTile(3, 'blue', 3)],
      [makeTile(4, 'green', 4), makeTile(5, 'green', 5), makeTile(6, 'green', 6)],
      [makeTile(7, 'amber', 7), makeTile(8, 'amber', 8), makeTile(9, 'amber', 9)],
    ],
    initialGrid: [
      [makeTile(7, 'amber', 7), makeTile(3, 'blue', 3), makeTile(1, 'blue', 1)],
      [makeTile(8, 'amber', 8), makeTile(5, 'green', 5), makeTile(6, 'green', 6)],
      [makeTile(9, 'amber', 9), makeTile(4, 'green', 4), makeTile(2, 'blue', 2)],
    ],
  },
  {
    id: 'hard-4',
    number: 12,
    title: 'Chromatic Latin Square',
    category: 'hard',
    type: 'logic',
    description: 'Constraint Rule: Each row must contain 3 distinct colors!',
    hintTip: 'No color can repeat within the same horizontal row.',
    parMoves: 5,
    maxMoves: 16,
    constraint: 'row_unique_colors',
    targetGrid: [
      [makeTile(1, 'blue'), makeTile(2, 'green'), makeTile(3, 'amber')],
      [makeTile(4, 'amber'), makeTile(5, 'blue'), makeTile(6, 'green')],
      [makeTile(7, 'green'), makeTile(8, 'amber'), makeTile(9, 'blue')],
    ],
    initialGrid: [
      [makeTile(2, 'green'), makeTile(3, 'amber'), makeTile(1, 'blue')],
      [makeTile(6, 'green'), makeTile(4, 'amber'), makeTile(5, 'blue')],
      [makeTile(7, 'green'), makeTile(8, 'amber'), makeTile(9, 'blue')],
    ],
  },
];

/**
 * Creates a custom procedurally generated puzzle.
 */
export function generateProceduralLevel(seedLevel?: number): LevelDefinition {
  const seed = seedLevel ?? Date.now();
  const colors: TileColor[] = ['blue', 'green', 'amber', 'rose', 'violet', 'slate'];

  // Base palette
  const c1 = colors[seed % colors.length];
  const c2 = colors[(seed + 2) % colors.length];
  const c3 = colors[(seed + 4) % colors.length];

  const targetGrid: Grid3x3 = [
    [makeTile(1, c1), makeTile(2, c2), makeTile(3, c3)],
    [makeTile(4, c3), makeTile(5, c1), makeTile(6, c2)],
    [makeTile(7, c2), makeTile(8, c3), makeTile(9, c1)],
  ];

  const steps = 3 + (seed % 3); // 3 to 5 steps
  const { scrambled } = scrambleGrid(targetGrid, steps);

  return {
    id: `custom-${seed}`,
    number: 99,
    title: `Procedural Pulse #${(seed % 1000).toString().padStart(3, '0')}`,
    category: 'medium',
    type: 'pattern',
    description: 'Algorithmically generated toroidal puzzle with guaranteed solvability.',
    hintTip: 'Look at the relative offsets of repeated colors across rows.',
    parMoves: steps,
    maxMoves: steps + 8,
    constraint: 'none',
    targetGrid,
    initialGrid: scrambled,
  };
}
