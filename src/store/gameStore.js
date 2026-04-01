import { create } from 'zustand';
import { generateDockShapes } from '../constants/shapes';

const GRID_SIZE = 8;
const INITIAL_GRID = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const canPlaceShapeOnGrid = (grid, shapeObj) => {
  if (!shapeObj || shapeObj.isPlaced) return false;
  const shape = shapeObj.shape;
  
  for (let r = 0; r <= GRID_SIZE - shape.length; r++) {
    for (let c = 0; c <= GRID_SIZE - shape[0].length; c++) {
      let canPlace = true;
      for (let sr = 0; sr < shape.length; sr++) {
        for (let sc = 0; sc < shape[0].length; sc++) {
          if (shape[sr][sc] === 1 && grid[r + sr][c + sc] === 1) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }
      if (canPlace) return true;
    }
  }
  return false;
};

export const useGameStore = create((set, get) => ({
  grid: INITIAL_GRID,
  dockShapes: generateDockShapes(),
  score: 0,
  highScore: parseInt(localStorage.getItem('blockBlastHighScore') || '0', 10),
  gameOver: false,
  soundEnabled: true,

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  resetGame: () => set(() => ({
    grid: INITIAL_GRID,
    dockShapes: generateDockShapes(),
    score: 0,
    gameOver: false,
  })),

  checkGameOver: () => {
    const { grid, dockShapes } = get();
    const remainingShapes = dockShapes.filter(s => !s.isPlaced);
    if (remainingShapes.length === 0) return false;

    for (const shape of remainingShapes) {
      if (canPlaceShapeOnGrid(grid, shape)) return false;
    }
    return true;
  },

  placeShape: (shapeId, startRow, startCol) => {
    const { grid, dockShapes, score, soundEnabled } = get();
    
    // Find shape
    const shapeObj = dockShapes.find(s => s.id === shapeId);
    if (!shapeObj || shapeObj.isPlaced) return false;
    
    const shape = shapeObj.shape;
    
    // Validate placement
    let valid = true;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === 1) {
          if (
            startRow + r >= GRID_SIZE || 
            startCol + c >= GRID_SIZE || 
            grid[startRow + r][startCol + c] === 1
          ) {
            valid = false;
          }
        }
      }
    }
    
    if (!valid) return false;

    // Place shape
    let newGrid = grid.map(row => [...row]);
    let blocksPlaced = 0;
    
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === 1) {
          newGrid[startRow + r][startCol + c] = 1;
          blocksPlaced++;
        }
      }
    }

    // Check lines cleared
    let rowsToClear = [];
    let colsToClear = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      if (newGrid[r].every(cell => cell === 1)) rowsToClear.push(r);
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newGrid.every(row => row[c] === 1)) colsToClear.push(c);
    }

    const linesCleared = rowsToClear.length + colsToClear.length;

    // Calculate score
    // Points for blocks placed (e.g. 10 * blocks)
    let addedScore = blocksPlaced * 10;
    // Points for lines cleared (e.g. combos)
    if (linesCleared > 0) {
      addedScore += (linesCleared * 100) * linesCleared; // Combo multiplier
      
      // Play sound
      if (soundEnabled) {
        // Simple synthetic ping or nothing since no assets
      }
    }

    // Clear lines
    rowsToClear.forEach(r => {
      for (let c = 0; c < GRID_SIZE; c++) newGrid[r][c] = 0;
    });
    colsToClear.forEach(c => {
      for (let r = 0; r < GRID_SIZE; r++) newGrid[r][c] = 0;
    });

    const newDockShapes = dockShapes.map(s => s.id === shapeId ? { ...s, isPlaced: true } : s);
    const allPlaced = newDockShapes.every(s => s.isPlaced);

    set((state) => {
      const newScore = state.score + addedScore;
      let newHighScore = state.highScore;
      if (newScore > state.highScore) {
        newHighScore = newScore;
        localStorage.setItem('blockBlastHighScore', newHighScore.toString());
      }
      
      return {
        grid: newGrid,
        score: newScore,
        highScore: newHighScore,
        dockShapes: allPlaced ? generateDockShapes() : newDockShapes,
      };
    });

    // Need setTimeout to check game over after state update
    setTimeout(() => {
      const isOver = get().checkGameOver();
      if (isOver) {
        set({ gameOver: true });
      }
    }, 0);

    return true;
  }
}));
