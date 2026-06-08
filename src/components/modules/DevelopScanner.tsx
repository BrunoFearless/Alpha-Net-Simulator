import { FC, useState } from 'react';
import { motion } from 'motion/react';

export const DevelopScanner: FC<{ color: string }> = ({ color }) => {
  const [hash, setHash] = useState('0x000...');
  const [score, setScore] = useState(0);

  const mine = () => {
    setHash(`0x${Math.random().toString(16).slice(2, 10)}`);
    setScore(s => s + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="font-mono text-xl" style={{ color }}>{hash}</div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={mine}
        className="px-4 py-2 bg-white/10 rounded-lg text-white text-xs font-bold border border-white/20"
      >
        MINE BLOCK
      </motion.button>
      <div className="text-zinc-400 text-xs font-mono">HASHES MINED: {score}</div>
    </div>
  );
};
