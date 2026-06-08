import { FC, useState } from 'react';
import { motion } from 'motion/react';

export const LazerGame: FC<{ color: string }> = ({ color }) => {
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reaction, setReaction] = useState(0);

  const start = () => {
    setActive(true);
    setStartTime(Date.now());
  };

  const end = () => {
    if (active) {
      setReaction(Date.now() - startTime);
      setActive(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center space-y-4">
      <motion.button
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        onClick={active ? end : start}
        className="w-20 h-20 rounded-full border-4"
        style={{ borderColor: color, backgroundColor: active ? color : 'transparent' }}
      >
        {active ? 'CLICK!' : 'START'}
      </motion.button>
      {reaction > 0 && <div className="text-white font-mono">REACT: {reaction}ms</div>}
    </div>
  );
};
