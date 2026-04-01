import React from 'react';

const Cell = ({ filled, isGhost, isHighlight }) => {
  return (
    <div
      className={`
        w-full aspect-square transition-all duration-150 rounded-[2px] sm:rounded-sm
        ${filled ? 'bg-[#f4f4f4] shadow-[inset_0_0_12px_rgba(0,0,0,0.25)] ring-1 ring-white/20' : 'bg-[#121212] border border-[#1f1f1f]'}
        ${isGhost && !filled ? 'bg-white/40 !border-2 !border-white z-10 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}
        ${isHighlight ? 'animate-pulse bg-white/50' : ''}
      `}
    />
  );
};

export default Cell;
