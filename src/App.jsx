import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Grid from './components/Grid';
import Dock from './components/Dock';
import GameMenu from './components/GameMenu';
import Sudoku from './components/Sudoku';
import { useGameStore } from './store/gameStore';
import { TrophyOutlined, SoundOutlined, RetweetOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

function App() {
  const { score, highScore, gameOver, resetGame, soundEnabled, toggleSound } = useGameStore();
  const [useTouch] = useState(isTouchDevice());
  const [currentGame, setCurrentGame] = useState('menu');

  const handleGameSelect = (game) => {
    setCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setCurrentGame('menu');
  };

  if (currentGame === 'menu') {
    return <GameMenu onSelectGame={handleGameSelect} />;
  }

  if (currentGame === 'sudoku') {
    return <Sudoku onBackToMenu={handleBackToMenu} />;
  }

  return (
    <DndProvider backend={useTouch ? TouchBackend : HTML5Backend} options={useTouch ? { enableMouseEvents: true } : {}}>
      <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center p-2 md:p-4 pb-6 md:pb-8 selection:bg-white/20">
        
        <header className="w-full max-w-md flex justify-between items-center mb-4 md:mb-8 px-1 md:px-2">
          <button
            onClick={handleBackToMenu}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftOutlined className="text-xl" />
          </button>
          
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-2xl text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">High Score</span>
              <span className="text-xl font-black leading-none">{highScore}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
             <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Score</span>
             <span className="text-3xl font-black leading-none tracking-tight">{score}</span>
          </div>

          <div className="flex items-center gap-4 text-xl">
             <button 
               onClick={toggleSound} 
               className="hover:text-gray-300 transition-colors drop-shadow-md"
               aria-label="Toggle Sound"
             >
               {soundEnabled ? <SoundOutlined /> : <SoundOutlined className="opacity-50 line-through" />}
             </button>
             <button 
               onClick={resetGame} 
               className="hover:rotate-180 transition-transform duration-500 ease-in-out drop-shadow-md"
               aria-label="Reset Game"
             >
               <RetweetOutlined />
             </button>
          </div>
        </header>

        <main className="relative flex flex-col items-center w-[95vw] max-w-[400px] md:max-w-[480px] select-none shadow-[0_0_120px_rgba(255,255,255,0.03)] bg-[#0a0a0a] p-2 md:p-4 rounded-2xl md:rounded-3xl border border-[#222]">
          <Grid />
          
          {gameOver && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
              <h2 className="text-4xl font-black mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">OUT OF MOVES</h2>
              <p className="text-gray-400 mb-6">Final Score: <span className="text-white font-bold">{score}</span></p>
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                Play Again
              </button>
            </div>
          )}
        </main>

        <section className="w-full mt-4 flex justify-center sticky bottom-4 z-10">
           <Dock />
        </section>

      </div>
    </DndProvider>
  );
}

export default App;
