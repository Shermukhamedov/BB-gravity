import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useGameStore } from '../store/gameStore';
import Cell from './Cell';

const Grid = () => {
  const { grid, placeShape } = useGameStore();
  const [ghost, setGhost] = useState(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'SHAPE',
    drop: (item, monitor) => {
      if (ghost && ghost.valid) {
        placeShape(item.id, ghost.row, ghost.col);
      }
      setGhost(null);
    },
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Ensure we have a reference to the grid bounding box to calculate row/col
      const gridRect = document.getElementById('game-grid').getBoundingClientRect();
      const cellSize = gridRect.width / 8;

      // Handle custom drag offset embedded in the item (by Shape component)
      const dragOffsetX = item.dragOffsetX || 0;
      const dragOffsetY = item.dragOffsetY || 0;

      // Adjust relative coordinates back to grid
      const x = clientOffset.x - gridRect.left - dragOffsetX + (cellSize / 2);
      const y = clientOffset.y - gridRect.top - dragOffsetY + (cellSize / 2);

      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      const shapeArr = item.shape;

      // Validate bounds
      let isValid = true;
      for (let r = 0; r < shapeArr.length; r++) {
        for (let c = 0; c < shapeArr[0].length; c++) {
          if (shapeArr[r][c] === 1) {
            if (
              row + r < 0 ||
              row + r >= 8 ||
              col + c < 0 ||
              col + c >= 8 ||
              (grid[row + r] && grid[row + r][col + c] === 1)
            ) {
              isValid = false;
            }
          }
        }
      }

      // If valid, show ghost, otherwise don't
      setGhost({ row, col, shape: shapeArr, valid: isValid });
    },
  });

  // Clear ghost when leaving
  useEffect(() => {
    if (!isOver) setGhost(null);
  }, [isOver]);

  return (
    <div
      id="game-grid"
      ref={drop}
      className={`grid grid-cols-8 gap-[1px] md:gap-[2px] bg-[#222] p-1 md:p-2 rounded-xl border-2 w-[95vw] max-w-[400px] md:max-w-[480px] aspect-square mx-auto shadow-2xl transition-colors ${
        isOver && canDrop ? 'border-white/50 bg-[#333]' : 'border-[#333]'
      }`}
    >
      {grid.map((rowArr, rowIndex) =>
        rowArr.map((cellFilled, colIndex) => {
          let hasGhost = false;

          // Check if this cell is part of the ghost shape
          if (ghost && ghost.valid) {
            const { row, col, shape } = ghost;
            const rDiff = rowIndex - row;
            const cDiff = colIndex - col;

            if (
              rDiff >= 0 &&
              rDiff < shape.length &&
              cDiff >= 0 &&
              cDiff < shape[0].length &&
              shape[rDiff][cDiff] === 1
            ) {
              hasGhost = true;
            }
          }

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              filled={cellFilled === 1}
              isGhost={hasGhost}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
