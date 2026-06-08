import { FC } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

export const CommunityRadar: FC<{ color: string }> = ({ color }) => {
  const nodes = [
    { x: 50, y: 30 },
    { x: 80, y: 70 },
    { x: 20, y: 60 },
    { x: 40, y: 20 },
  ];

  return (
    <div className="relative w-full h-full p-4 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
        {nodes.map((node, i) => (
          <motion.g 
            key={i} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, transition: { delay: i * 0.2 } }}
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
          >
            <circle cx={node.x} cy={node.y} r="3" fill={color} />
            <line x1="50" y1="50" x2={node.x} y2={node.y} stroke={color} strokeWidth="0.2" className="opacity-20" />
            <text x={node.x + 4} y={node.y + 1} fontSize="4" fill="white" className="font-mono text-[4px]">HUB_{i+1}</text>
          </motion.g>
        ))}
        <Users className="absolute w-8 h-8" style={{ color }} />
      </svg>
    </div>
  );
};
