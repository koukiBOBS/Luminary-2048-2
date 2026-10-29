import { Direction, TileData, GameState, GameHistorySnapshot } from '../types';
import { GRID_SIZE } from '../constants';

let uniqueIdCounter = 0;

export function getNewId(): number {
  return ++uniqueIdCounter;
}

export const restoreIdCounter = (tiles: TileData[]) => {
  if (tiles.length > 0) {
    const maxId = Math.max(...tiles.map(t => t.id || 0));
    if (maxId >= uniqueIdCounter) {
      uniqueIdCounter = maxId + 1;
    }
  }
};

export const getInitialState = (): GameState => {
  const tiles: TileData[] = [];
  addRandomTile(tiles);
  addRandomTile(tiles);
  
  // Load best score from local storage safely
  let bestScore = 0;
  try {
    const saved = localStorage.getItem('luminary2048-best');
    if (saved) bestScore = parseInt(saved, 10) || 0;
  } catch (e) {
    console.error("Storage access error", e);
  }

  return {
    tiles,
    score: 0,
    bestScore,
    won: false,
    over: false,
    lastMoveDirection: null,
    history: [],
  };
};

export const serializeGameState = (state: GameState): string => {
  try {
    const cleanState = {
      tiles: state.tiles.filter(t => !t.isDying).map(t => ({
        id: t.id,
        value: t.value,
        row: t.row,
        col: t.col
      })),
      score: state.score,
      bestScore: state.bestScore,
      won: state.won,
      over: state.over,
      lastMoveDirection: state.lastMoveDirection,
      history: (state.history || []).slice(-30).map(h => ({
        tiles: h.tiles.map(t => ({ id: t.id, value: t.value, row: t.row, col: t.col })),
        score: h.score,
      }))
    };
    const json = JSON.stringify(cleanState);
    return btoa(json);
  } catch (e) {
    console.error("Failed to serialize", e);
    return "";
  }
};

export const deserializeGameState = (code: string): GameState | null => {
  try {
    const json = atob(code.trim());
    const parsed = JSON.parse(json);
    if (!parsed || !Array.isArray(parsed.tiles) || typeof parsed.score !== 'number') {
      return null;
    }
    restoreIdCounter(parsed.tiles);

    const history: GameHistorySnapshot[] = Array.isArray(parsed.history)
      ? parsed.history.map((h: { tiles?: TileData[]; score?: number }) => ({
          tiles: Array.isArray(h.tiles)
            ? h.tiles.map((t: TileData) => ({
                id: t.id || getNewId(),
                value: t.value,
                row: t.row,
                col: t.col,
                isNew: false,
                isMerged: false,
                isDying: false
              }))
            : [],
          score: typeof h.score === 'number' ? h.score : 0
        }))
      : [];

    return {
      tiles: parsed.tiles.map((t: TileData) => ({
        id: t.id || getNewId(),
        value: t.value,
        row: t.row,
        col: t.col,
        isNew: false,
        isMerged: false,
        isDying: false
      })),
      score: parsed.score,
      bestScore: Math.max(parsed.bestScore || 0, parsed.score),
      won: !!parsed.won,
      over: !!parsed.over,
      lastMoveDirection: parsed.lastMoveDirection || null,
      history
    };
  } catch (e) {
    console.error("Failed to deserialize", e);
    return null;
  }
};

export const addRandomTile = (tiles: TileData[]) => {
  const occupied = new Set(tiles.filter(t => !t.isDying).map(t => `${t.row},${t.col}`));
  const emptyCells: { r: number; c: number }[] = [];
  
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!occupied.has(`${r},${c}`)) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    tiles.push({
      id: getNewId(),
      value,
      row: r,
      col: c,
      isNew: true,
      isMerged: false,
      isDying: false,
    });
  }
};

const getVector = (direction: Direction) => {
  const map = {
    UP: { r: -1, c: 0 },
    DOWN: { r: 1, c: 0 },
    LEFT: { r: 0, c: -1 },
    RIGHT: { r: 0, c: 1 },
  };
  return map[direction];
};

export const moveTiles = (state: GameState, direction: Direction): { nextState: GameState; moved: boolean; scoreToAdd: number } => {
  if (state.over) return { nextState: state, moved: false, scoreToAdd: 0 };

  const vector = getVector(direction);

  // Snapshot current state for multi-step undo history
  const currentSnapshot: GameHistorySnapshot = {
    tiles: state.tiles.filter(t => !t.isDying).map(t => ({ ...t, isNew: false, isMerged: false })),
    score: state.score,
  };

  const tiles = state.tiles
    .filter(t => !t.isDying)
    .map(t => ({ ...t, isNew: false, isMerged: false }));
    
  let moved = false;
  let scoreToAdd = 0;
  const mergedIds = new Set<number>();

  // Sort order depends on direction of movement
  tiles.sort((a, b) => {
    if (direction === 'UP') return a.row - b.row;
    if (direction === 'DOWN') return b.row - a.row;
    if (direction === 'LEFT') return a.col - b.col;
    if (direction === 'RIGHT') return b.col - a.col;
    return 0;
  });

  const positionMap = new Map<string, TileData>();
  tiles.forEach(t => positionMap.set(`${t.row},${t.col}`, t));

  const newTiles: TileData[] = [];

  for (const tile of tiles) {
    let { row, col } = tile;
    let nextRow = row + vector.r;
    let nextCol = col + vector.c;
    let bestRow = row;
    let bestCol = col;
    let mergeTarget: TileData | null = null;

    while (
      nextRow >= 0 && nextRow < GRID_SIZE &&
      nextCol >= 0 && nextCol < GRID_SIZE
    ) {
      const key = `${nextRow},${nextCol}`;
      const obstacle = positionMap.get(key);

      if (obstacle) {
        if (obstacle.value === tile.value && !mergedIds.has(obstacle.id)) {
          mergeTarget = obstacle;
        }
        break;
      } else {
        bestRow = nextRow;
        bestCol = nextCol;
        nextRow += vector.r;
        nextCol += vector.c;
      }
    }

    if (mergeTarget) {
      positionMap.delete(`${tile.row},${tile.col}`);
      tile.row = mergeTarget.row;
      tile.col = mergeTarget.col;
      tile.isDying = true;
      
      mergeTarget.value *= 2;
      mergeTarget.isMerged = true;
      mergedIds.add(mergeTarget.id);
      
      scoreToAdd += mergeTarget.value;
      moved = true;
    } else {
      if (bestRow !== tile.row || bestCol !== tile.col) {
        positionMap.delete(`${tile.row},${tile.col}`);
        tile.row = bestRow;
        tile.col = bestCol;
        positionMap.set(`${bestRow},${bestCol}`, tile);
        moved = true;
      }
    }
    newTiles.push(tile);
  }
  
  if (!moved) {
    if (state.tiles.length !== newTiles.length) {
      return { nextState: { ...state, tiles: newTiles }, moved: false, scoreToAdd: 0 };
    }
    return { nextState: state, moved: false, scoreToAdd: 0 };
  }

  addRandomTile(newTiles);

  // Stable sort by id so React preserves DOM node identity during sliding transitions
  newTiles.sort((a, b) => a.id - b.id);

  const activeTiles = newTiles.filter(t => !t.isDying);
  const won = activeTiles.some(t => t.value === 2048) && !state.won;

  let over = false;
  if (activeTiles.length === GRID_SIZE * GRID_SIZE) {
    let canMove = false;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 1; c++) {
        const t1 = activeTiles.find(t => t.row === r && t.col === c);
        const t2 = activeTiles.find(t => t.row === r && t.col === c + 1);
        if (t1 && t2 && t1.value === t2.value) canMove = true;
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 1; r++) {
        const t1 = activeTiles.find(t => t.row === r && t.col === c);
        const t2 = activeTiles.find(t => t.row === r + 1 && t.col === c);
        if (t1 && t2 && t1.value === t2.value) canMove = true;
      }
    }
    if (!canMove) over = true;
  }

  const newScore = state.score + scoreToAdd;
  const newBest = Math.max(state.bestScore, newScore);
  try {
    localStorage.setItem('luminary2048-best', newBest.toString());
  } catch (e) {
    // Ignore storage errors
  }

  // Multi-step history: append current snapshot, keep up to 60 steps
  const updatedHistory = [...(state.history || []), currentSnapshot].slice(-60);

  return {
    nextState: {
      ...state,
      tiles: newTiles,
      score: newScore,
      bestScore: newBest,
      won: state.won || won,
      over,
      lastMoveDirection: direction,
      history: updatedHistory,
    },
    moved: true,
    scoreToAdd
  };
};

export const undoMove = (state: GameState): GameState => {
  if (!state.history || state.history.length === 0) return state;

  // Pop the latest historical snapshot
  const newHistory = [...state.history];
  const lastSnapshot = newHistory.pop()!;

  restoreIdCounter(lastSnapshot.tiles);

  return {
    ...state,
    tiles: lastSnapshot.tiles.map(t => ({ ...t, isNew: false, isMerged: false, isDying: false })),
    score: lastSnapshot.score,
    over: false,
    history: newHistory,
  };
};