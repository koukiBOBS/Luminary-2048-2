import { Direction, TileData, GameState } from '../types';
import { GRID_SIZE } from '../constants';

let uniqueIdCounter = 0;

function getNewId(): number {
  return ++uniqueIdCounter;
}

export const getInitialState = (): GameState => {
  const tiles: TileData[] = [];
  addRandomTile(tiles);
  addRandomTile(tiles);
  
  // Load best score from local storage safely
  let bestScore = 0;
  try {
    const saved = localStorage.getItem('luminary2048-best');
    if (saved) bestScore = parseInt(saved, 10);
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
  };
};

export const serializeGameState = (state: GameState): string => {
  try {
    const json = JSON.stringify(state);
    return btoa(json);
  } catch (e) {
    console.error("Failed to serialize", e);
    return "";
  }
};

export const deserializeGameState = (code: string): GameState | null => {
  try {
    const json = atob(code);
    const state = JSON.parse(json);
    // Basic validation
    if (!state.tiles || typeof state.score !== 'number') return null;
    return state;
  } catch (e) {
    console.error("Failed to deserialize", e);
    return null;
  }
};

export const addRandomTile = (tiles: TileData[]) => {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`));
  const emptyCells = [];
  
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

export const moveTiles = (state: GameState, direction: Direction): GameState => {
  if (state.over) return state;

  const vector = getVector(direction);
  // Remove tiles that were marked as dying in the previous turn
  const tiles = state.tiles
    .filter(t => !t.isDying)
    .map(t => ({ ...t, isNew: false, isMerged: false }));
    
  let moved = false;
  let scoreToAdd = 0;
  const mergedIds = new Set<number>();

  // Sorting helps process movement in correct order
  // For UP: sort by row asc. DOWN: row desc. LEFT: col asc. RIGHT: col desc.
  tiles.sort((a, b) => {
    if (direction === 'UP') return a.row - b.row;
    if (direction === 'DOWN') return b.row - a.row;
    if (direction === 'LEFT') return a.col - b.col;
    if (direction === 'RIGHT') return b.col - a.col;
    return 0;
  });

  // We need a map of current positions to checks collisions efficiently
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

    // Simulate sliding
    while (
      nextRow >= 0 && nextRow < GRID_SIZE &&
      nextCol >= 0 && nextCol < GRID_SIZE
    ) {
      const key = `${nextRow},${nextCol}`;
      const obstacle = positionMap.get(key);

      if (obstacle) {
        // Check merge
        if (obstacle.value === tile.value && !mergedIds.has(obstacle.id)) {
          mergeTarget = obstacle;
        }
        break; // Stop sliding either way
      } else {
        bestRow = nextRow;
        bestCol = nextCol;
        nextRow += vector.r;
        nextCol += vector.c;
      }
    }

    if (mergeTarget) {
      positionMap.delete(`${tile.row},${tile.col}`); // Remove old pos
      tile.row = mergeTarget.row;
      tile.col = mergeTarget.col;
      tile.isDying = true; // Mark as dying so it animates to position but is ignored next turn
      
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
    newTiles.push(tile); // Keep all tiles (including dying ones for animation)
  }
  
  if (!moved) {
    // If nothing moved, we still need to clean up any dying tiles from previous state
    // but the filter at the start handled that.
    // However, we should return the cleaned state if it changed.
    if (state.tiles.length !== newTiles.length) {
       return { ...state, tiles: newTiles };
    }
    return state;
  }

  // Spawn new tile - activeTiles check handles excluding dying tiles from valid spawn points
  addRandomTile(newTiles);

  // Check Game Won
  const activeTiles = newTiles.filter(t => !t.isDying);
  const won = activeTiles.some(t => t.value === 2048) && !state.won;

  // Check Game Over
  let over = false;
  if (activeTiles.length === GRID_SIZE * GRID_SIZE) {
    // Check for possible moves
    let canMove = false;
    // Horizontal checks
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE-1; c++) {
         const t1 = activeTiles.find(t => t.row === r && t.col === c);
         const t2 = activeTiles.find(t => t.row === r && t.col === c+1);
         if(t1 && t2 && t1.value === t2.value) canMove = true;
      }
    }
    // Vertical checks
    for(let c=0; c<GRID_SIZE; c++) {
      for(let r=0; r<GRID_SIZE-1; r++) {
         const t1 = activeTiles.find(t => t.row === r && t.col === c);
         const t2 = activeTiles.find(t => t.row === r+1 && t.col === c);
         if(t1 && t2 && t1.value === t2.value) canMove = true;
      }
    }
    if (!canMove) over = true;
  }

  const newScore = state.score + scoreToAdd;
  const newBest = Math.max(state.bestScore, newScore);
  localStorage.setItem('luminary2048-best', newBest.toString());

  return {
    ...state,
    tiles: newTiles,
    score: newScore,
    bestScore: newBest,
    won: state.won || won,
    over,
    lastMoveDirection: direction,
  };
};