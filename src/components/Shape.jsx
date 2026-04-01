import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

const Shape = ({ shapeObj }) => {
  const { id, shape, isPlaced } = shapeObj;
  const shapeRef = useRef(null);
  const touchOffsetRef = useRef({ x: 0, y: 0 });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'SHAPE',
    item: (monitor) => {
      let dragOffsetX = 0;
      let dragOffsetY = 0;
      const initialOffset = monitor.getInitialClientOffset();
      const initialSource = monitor.getInitialSourceClientOffset();
      if (initialOffset && initialSource) {
        dragOffsetX = initialOffset.x - initialSource.x;
        dragOffsetY = initialOffset.y - initialSource.y;
      }
      return { id, shape, dragOffsetX, dragOffsetY };
    },
    canDrag: !isPlaced,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Use empty image for HTML5 backend so we can render custom drag ghost if needed
  // But natively react-dnd handles the clone. For mobile touch backend, the clone is handled by backend.
  
  if (isPlaced) {
    return (
      <div className="w-24 h-24 flex items-center justify-center opacity-10">
        <div className="text-gray-500 text-xs">Used</div>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`relative cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? 'opacity-50 scale-90' : 'opacity-100 hover:scale-105'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div className="flex flex-col gap-[1px] md:gap-[2px] transform scale-75 sm:scale-90 md:scale-100 origin-bottom filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] md:-translate-y-0 pb-1">
        {shape.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-[1px] md:gap-[2px]">
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                className={`w-[8vw] h-[8vw] sm:w-[9vw] sm:h-[9vw] max-w-[28px] max-h-[28px] sm:max-w-[36px] sm:max-h-[36px] md:w-10 md:h-10 rounded-[2px] md:rounded-[3px] ${
                  cell === 1 ? 'bg-[#f4f4f4] shadow-[inset_0_0_8px_rgba(0,0,0,0.15)] ring-1 ring-white/30' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shape;
