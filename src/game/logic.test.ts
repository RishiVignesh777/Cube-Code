import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTile,
  cloneGrid,
  slideRowLeft,
  slideRowRight,
  slideColUp,
  slideColDown,
  applyMove,
  getInverseMove,
  isWinningState,
  checkConstraints,
  solveBFS,
  calculateStars,
  scrambleGrid,
} from './logic';
import { Grid3x3, Tile } from './types';
import { LEVELS } from './levels';

// Helper to make test grids easily
function makeNumberedGrid(): Grid3x3 {
  let id = 1;
  const grid: any[] = [];
  for (let r = 0; r < 3; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < 3; c++) {
      row.push(createTile(id, 'blue', id));
      id++;
    }
    grid.push(row);
  }
  return grid as Grid3x3;
}

test('slideRowRight cyclically shifts row 0 elements to the right', () => {
  const g = makeNumberedGrid();
  // Row 0 initially: [1, 2, 3]
  const next = slideRowRight(g, 0);
  assert.equal(next[0][0].numberVal, 3);
  assert.equal(next[0][1].numberVal, 1);
  assert.equal(next[0][2].numberVal, 2);
  // Other rows untouched
  assert.equal(next[1][0].numberVal, 4);
  assert.equal(next[2][0].numberVal, 7);
});

test('slideRowLeft cyclically shifts row 1 elements to the left', () => {
  const g = makeNumberedGrid();
  // Row 1 initially: [4, 5, 6]
  const next = slideRowLeft(g, 1);
  assert.equal(next[1][0].numberVal, 5);
  assert.equal(next[1][1].numberVal, 6);
  assert.equal(next[1][2].numberVal, 4);
});

test('slideColDown cyclically shifts col 0 elements downward', () => {
  const g = makeNumberedGrid();
  // Col 0 initially: [1, 4, 7]
  const next = slideColDown(g, 0);
  assert.equal(next[0][0].numberVal, 7);
  assert.equal(next[1][0].numberVal, 1);
  assert.equal(next[2][0].numberVal, 4);
});

test('slideColUp cyclically shifts col 2 elements upward', () => {
  const g = makeNumberedGrid();
  // Col 2 initially: [3, 6, 9]
  const next = slideColUp(g, 2);
  assert.equal(next[0][2].numberVal, 6);
  assert.equal(next[1][2].numberVal, 9);
  assert.equal(next[2][2].numberVal, 3);
});

test('move and inverse move restore original state', () => {
  const g = makeNumberedGrid();
  const move1 = { type: 'row' as const, index: 1 as const, direction: 'left' as const };
  const shifted = applyMove(g, move1);
  const inverse = getInverseMove(move1);
  const restored = applyMove(shifted, inverse);

  assert.equal(restored[1][0].numberVal, g[1][0].numberVal);
  assert.equal(restored[1][1].numberVal, g[1][1].numberVal);
  assert.equal(restored[1][2].numberVal, g[1][2].numberVal);
});

test('isWinningState correctly identifies equal sequence grids', () => {
  const g1 = makeNumberedGrid();
  const g2 = makeNumberedGrid();
  assert.equal(isWinningState(g1, g2, 'sequence'), true);

  const modified = slideRowLeft(g1, 0);
  assert.equal(isWinningState(modified, g2, 'sequence'), false);
});

test('checkConstraints validates no adjacent same color', () => {
  const gridOk: Grid3x3 = [
    [createTile(1, 'blue'), createTile(2, 'green'), createTile(3, 'blue')],
    [createTile(4, 'green'), createTile(5, 'blue'), createTile(6, 'green')],
    [createTile(7, 'blue'), createTile(8, 'green'), createTile(9, 'blue')],
  ];
  assert.equal(checkConstraints(gridOk, 'no_adjacent_same_color'), true);

  const gridBad: Grid3x3 = [
    [createTile(1, 'blue'), createTile(2, 'blue'), createTile(3, 'green')],
    [createTile(4, 'green'), createTile(5, 'amber'), createTile(6, 'green')],
    [createTile(7, 'blue'), createTile(8, 'green'), createTile(9, 'blue')],
  ];
  assert.equal(checkConstraints(gridBad, 'no_adjacent_same_color'), false);
});

test('solveBFS finds the optimal solution sequence for scrambled boards', () => {
  const target = makeNumberedGrid();
  // Apply 2 distinct moves: Row 0 Right, Col 1 Down
  const m1 = { type: 'row' as const, index: 0 as const, direction: 'right' as const };
  const m2 = { type: 'col' as const, index: 1 as const, direction: 'down' as const };
  const scrambled = applyMove(applyMove(target, m1), m2);

  const solution = solveBFS(scrambled, target, 'sequence', 'none', 6);
  assert.ok(solution !== null);
  assert.equal(solution.length, 2);

  // Applying solution moves to scrambled grid must reach target
  let resolved = cloneGrid(scrambled);
  for (const step of solution) {
    resolved = applyMove(resolved, step);
  }
  assert.equal(isWinningState(resolved, target, 'sequence'), true);
});

test('calculateStars awards correct ratings based on move count', () => {
  assert.equal(calculateStars(3, 3, 10), 3);
  assert.equal(calculateStars(4, 3, 10), 2);
  assert.equal(calculateStars(5, 3, 10), 2);
  assert.equal(calculateStars(7, 3, 10), 1);
  assert.equal(calculateStars(11, 3, 10), 0);
});

test('scrambleGrid produces valid solvable board', () => {
  const target = makeNumberedGrid();
  const { scrambled } = scrambleGrid(target, 3);
  // Solve with BFS
  const sol = solveBFS(scrambled, target, 'sequence', 'none', 5);
  assert.ok(sol !== null);
  assert.ok(sol.length <= 3);
});

test('checkConstraints validates corners_matching and row_unique_colors', () => {
  const cornersOk: Grid3x3 = [
    [createTile(1, 'rose'), createTile(2, 'blue'), createTile(3, 'rose')],
    [createTile(4, 'blue'), createTile(5, 'amber'), createTile(6, 'blue')],
    [createTile(7, 'rose'), createTile(8, 'blue'), createTile(9, 'rose')],
  ];
  assert.equal(checkConstraints(cornersOk, 'corners_matching'), true);

  const rowUniqueOk: Grid3x3 = [
    [createTile(1, 'blue'), createTile(2, 'green'), createTile(3, 'amber')],
    [createTile(4, 'amber'), createTile(5, 'blue'), createTile(6, 'green')],
    [createTile(7, 'green'), createTile(8, 'amber'), createTile(9, 'blue')],
  ];
  assert.equal(checkConstraints(rowUniqueOk, 'row_unique_colors'), true);
});

test('Level 1 starts unsolved and BFS finds 2-move solution', () => {
  const lvl = LEVELS[0];
  assert.equal(isWinningState(lvl.initialGrid, lvl.targetGrid, lvl.type, lvl.constraint), false);
  const solution = solveBFS(lvl.initialGrid, lvl.targetGrid, lvl.type, lvl.constraint, 5);
  assert.ok(solution !== null);
  assert.equal(solution.length, 2);
});
