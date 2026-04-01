import React from 'react';
import Shape from './Shape';
import { useGameStore } from '../store/gameStore';

const Dock = () => {
  const { dockShapes } = useGameStore();

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-8 min-h-[110px] md:min-h-[140px] w-full max-w-[95vw] sm:max-w-md mx-auto p-2 sm:p-4 bg-[#111] rounded-xl sm:rounded-2xl border border-[#333] mt-4 sm:mt-8 shadow-[0_-10px_40px_rgba(255,255,255,0.05)] shadow-white/5">
      {dockShapes.map((shapeObj) => (
        <div key={shapeObj.id} className="flex-1 flex justify-center items-center">
          <Shape shapeObj={shapeObj} />
        </div>
      ))}
    </div>
  );
};

export default Dock;
