import { FC } from 'react';
import { User } from '../types';
import { CustomAvatar } from './CustomAvatar';

interface AvatarDisplayProps {
  user: User;
  className?: string;
  onClick?: () => void;
}

export const AvatarDisplay: FC<AvatarDisplayProps> = ({ user, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className={`overflow-hidden shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {user.avatarConfig ? (
        <CustomAvatar config={user.avatarConfig} className="w-full h-full object-cover" />
      ) : (
        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
      )}
    </div>
  );
};
