import { FC, useState } from 'react';
import { motion, Reorder } from 'motion/react';

export const CreatorCanvas: FC<{ color: string }> = ({ color }) => {
  const [items, setItems] = useState(['Drop 1', 'Drop 2', 'Drop 3', 'Drop 4']);

  return (
    <Reorder.Group axis="y" onReorder={setItems} values={items} className="w-full h-full p-4 overflow-y-auto space-y-2">
      {items.map((item) => (
        <Reorder.Item key={item} value={item} className="p-4 rounded-lg bg-white/5 border border-white/10 cursor-grab flex items-center justify-between" style={{ borderColor: color }}>
          <span className="font-mono text-sm text-white">{item}</span>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
