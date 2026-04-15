import React from 'react';
import { TrophyOutlined, BorderOutlined } from '@ant-design/icons';

const GameMenu = ({ onSelectGame }) => {
  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          GAME HUB
        </h1>
        <p className="text-gray-400 text-lg">Choose your game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <button
          onClick={() => onSelectGame('blockbluster')}
          className="group relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrophyOutlined className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold">Block Blaster</h2>
            <p className="text-gray-400 text-sm text-center">
              Drag and drop blocks to clear lines and score points
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectGame('sudoku')}
          className="group relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <BorderOutlined className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold">Sudoku</h2>
            <p className="text-gray-400 text-sm text-center">
              Fill the grid with numbers following Sudoku rules
            </p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-xs">
          Select a game to start playing
        </p>
      </div>
    </div>
  );
};

export default GameMenu;
