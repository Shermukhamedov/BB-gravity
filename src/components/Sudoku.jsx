import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RetweetOutlined, CheckOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const createEmptyGrid = () => Array(9).fill().map(() => Array(9).fill(0));

const isValidMove = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateSudoku = () => {
  const grid = createEmptyGrid();
  
  for (let box = 0; box < 9; box += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        grid[box + i][box + j] = nums[randomIndex];
        nums.splice(randomIndex, 1);
      }
    }
  }
  
  solveSudoku(grid);
  return grid;
};

const removeNumbers = (grid, difficulty = 'medium') => {
  const cellsToRemove = difficulty === 'medium' ? 45 : 35;
  const puzzle = grid.map(row => [...row]);
  let removed = 0;
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return puzzle;
};

const checkWin = (grid, solution) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
};


const Sudoku = ({ onBackToMenu }) => {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const timeoutRef = useRef(null);
  const greenTimeoutRef = useRef(null);

  const initNewGame = useCallback(() => {
    const newSolution = generateSudoku();
    const newPuzzle = removeNumbers(newSolution, 'medium');
    
    setSolution(newSolution);
    setGrid(newPuzzle);
    setInitialGrid(newPuzzle.map(row => [...row]));
    setTimer(0);
    setIsRunning(true);
    setGameWon(false);
    setShowErrors(false);
    setShowCorrect(false);
    setSelectedCell(null);
  }, []);

  useEffect(() => {
    initNewGame();
  }, [initNewGame]);

  useEffect(() => {
    let interval;
    if (isRunning && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameWon]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num) => {
    if (selectedCell && initialGrid[selectedCell.row][selectedCell.col] === 0) {
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = num;
      setGrid(newGrid);
      
      if (checkWin(newGrid, solution)) {
        setGameWon(true);
        setIsRunning(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedCell && e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleNumberInput(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, grid, initialGrid, solution]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (greenTimeoutRef.current) clearTimeout(greenTimeoutRef.current);
    };
  }, []);

  const handleCheck = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (greenTimeoutRef.current) clearTimeout(greenTimeoutRef.current);
    
    setShowErrors(true);
    setShowCorrect(true);
    
    timeoutRef.current = setTimeout(() => {
      const newGrid = grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          if (cell !== 0 && cell !== solution[rowIndex][colIndex] && initialGrid[rowIndex][colIndex] === 0) {
            return 0;
          }
          return cell;
        })
      );
      
      setGrid(newGrid);
      setShowErrors(false);
    }, 1500);
    
    greenTimeoutRef.current = setTimeout(() => {
      setShowCorrect(false);
    }, 3000);
  };

  const getCellClass = (row, col, value) => {
    let classes = "w-10 h-10 md:w-12 md:h-12 border border-gray-600 flex items-center justify-center text-lg md:text-xl font-bold cursor-pointer transition-all ";
    
    if (row % 3 === 0 && row !== 0) classes += "border-t-2 border-t-gray-400 ";
    if (col % 3 === 0 && col !== 0) classes += "border-l-2 border-l-gray-400 ";
    if (row === 8) classes += "border-b-2 border-b-gray-400 ";
    if (col === 8) classes += "border-r-2 border-r-gray-400 ";
    
    if (initialGrid[row][col] !== 0) {
      classes += "bg-gray-800 text-gray-300 cursor-not-allowed ";
    } else {
      classes += "bg-[#0a0a0a] hover:bg-gray-800 ";
    }
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      classes += "ring-2 ring-blue-500 bg-blue-900/30 ";
    }
    
    if (showErrors && value !== 0 && value !== solution[row][col] && initialGrid[row][col] === 0) {
      classes += "text-red-500 bg-red-900/30 ";
    }
    
    if (showCorrect && value !== 0 && value === solution[row][col] && initialGrid[row][col] === 0) {
      classes += "text-green-400 bg-green-900/30 ";
    }
    
    if (selectedCell && value !== 0 && value === grid[selectedCell.row][selectedCell.col]) {
      classes += "bg-blue-900/20 ";
    }
    
    return classes;
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <button
          onClick={onBackToMenu}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-xl text-green-400" />
          <span className="text-xl font-bold">{formatTime(timer)}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Check for errors"
          >
            <CheckOutlined className="text-xl text-yellow-400" />
          </button>
          <button
            onClick={initNewGame}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="New game"
          >
            <RetweetOutlined className="text-xl text-blue-400" />
          </button>
        </div>
      </header>

      <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
        SUDOKU
      </h1>

      <main className="relative">
        <div className="grid grid-cols-9 gap-0 bg-[#0a0a0a] p-2 rounded-2xl border border-[#222] shadow-[0_0_120px_rgba(255,255,255,0.03)]">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex, cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>

        {gameWon && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
            <h2 className="text-4xl font-black mb-2 text-white drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
              PUZZLE SOLVED!
            </h2>
            <p className="text-gray-400 mb-6">Time: <span className="text-white font-bold">{formatTime(timer)}</span></p>
            <button
              onClick={initNewGame}
              className="px-8 py-3 bg-green-500 text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              New Game
            </button>
          </div>
        )}
      </main>

      
      <div className="mt-6 text-center text-gray-500 text-sm max-w-md">
        <p>Click a cell and type a number (1-9) using your keyboard.</p>
        <p className="mt-1">Press Delete or Backspace to clear a cell.</p>
        <p className="mt-1">Fill the grid so each row, column, and 3x3 box contains 1-9.</p>
        {(showErrors || showCorrect) && (
          <div className="mt-3 p-2 bg-gray-800 rounded-lg">
            <p className="text-green-400">Green = Correct answers</p>
            <p className="text-red-400">Red = Mistakes (will be removed)</p>
            <p className="text-gray-400 text-xs mt-1">Red mistakes will disappear in 1.5 seconds</p>
            <p className="text-gray-400 text-xs mt-1">Green highlighting will disappear in 3 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sudoku;
