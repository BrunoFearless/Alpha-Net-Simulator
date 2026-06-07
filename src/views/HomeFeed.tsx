import React, { FC, useState, useEffect } from 'react';
import { MOCK_POSTS, CURRENT_USER, MOCK_USERS } from '../data';
import { Heart, MessageSquare, Repeat2, Share, Image as ImageIcon, Smile, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Post, User } from '../types';
import { UserProfileModal } from '../components/UserProfileModal';
import { AvatarDisplay } from '../components/AvatarDisplay';

const PostCard: FC<{ post: Post; onUpdate: (p: Post) => void; onUserClick: (u: User) => void }> = ({ post, onUpdate, onUserClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userTokens, setUserTokens] = useState(() => parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));

  useEffect(() => {
    const handleStorage = () => setUserTokens(parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleLike = () => {
    const nextLiked = !post.isLiked;
    const nextLikes = nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
    onUpdate({ ...post, isLiked: nextLiked, likes: nextLikes });
  };

  const handleBoost = () => {
    if (userTokens >= 50) {
      localStorage.setItem('alpha_net_tokens', (userTokens - 50).toString());
      // Trigger a storage event so other tabs/components update
      window.dispatchEvent(new Event('storage'));
      
      onUpdate({ ...post, boostedTokens: (post.boostedTokens || 0) + 50 });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `c_${Date.now()}`,
      author: CURRENT_USER,
      content: commentText,
      timestamp: 'Agora'
    };
    
    onUpdate({ 
      ...post, 
      comments: post.comments + 1,
      commentsList: [...(post.commentsList || []), newComment]
    });
    setCommentText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl mb-4 relative overflow-hidden transition-all duration-300 ${post.boostedTokens ? 'bg-[#FFD83D]/5 border border-[#FFD83D]/30 shadow-[0_0_20px_rgba(255,216,61,0.1)]' : 'bg-white/5 border border-white/10'}`}
    >
      {post.boostedTokens ? (
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD83D]/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      ) : null}

      <div className="flex gap-4 relative z-10">
        <AvatarDisplay 
          user={post.author} 
          className={`w-10 h-10 rounded-full bg-zinc-800 shrink-0 cursor-pointer border hover:border-white/40 transition-colors ${post.boostedTokens ? 'border-[#FFD83D]' : 'border-white/10'}`} 
          onClick={() => onUserClick(post.author)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span 
              className="font-semibold text-sm hover:underline cursor-pointer truncate flex items-center gap-1.5"
              onClick={() => onUserClick(post.author)}
            >
              {post.author.displayName}
              {post.author.badges.includes('AI') && <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[8px] px-1 rounded uppercase tracking-widest font-mono mt-0.5">BOT</span>}
            </span>
            <span className={`font-mono text-xs truncate ${post.boostedTokens ? 'text-[#FFD83D]/70' : 'text-zinc-500'}`}>{post.author.username}</span>
            <span className="text-zinc-600 text-xs shrink-0">· {post.timestamp}</span>
            {post.boostedTokens ? (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-[#FFD83D] bg-[#FFD83D]/10 px-2 py-0.5 rounded font-mono uppercase">
                <Zap fill="currentColor" className="w-3 h-3" /> Promovido ({post.boostedTokens})
              </span>
            ) : null}
          </div>
          
          <p className="text-sm text-zinc-200 mb-3 leading-relaxed">{post.content}</p>
          
          {post.media && (
            <div className={`rounded-xl overflow-hidden border mb-3 ${post.boostedTokens ? 'border-[#FFD83D]/20' : 'border-white/5'}`}>
              <img src={post.media} alt="Post media" className="w-full object-cover max-h-96" />
            </div>
          )}

          <div className="flex items-center gap-6 mt-4">
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${post.isLiked ? 'text-[#FF4A4A]' : 'text-zinc-500 hover:text-[#FF4A4A]'}`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${showComments ? 'text-[#3BA8FF]' : 'text-zinc-500 hover:text-[#3BA8FF]'}`}
            >
              <MessageSquare className="w-4 h-4" /> {post.comments}
            </button>
            <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#A5E600] font-mono transition-colors">
              <Repeat2 className="w-4 h-4" /> {post.shares}
            </button>
            
            <button 
              onClick={handleBoost}
              disabled={userTokens < 50}
              title="Impulsionar (Custa 50 Tokens)"
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ml-auto ${userTokens >= 50 ? 'text-zinc-500 hover:text-[#FFD83D]' : 'text-zinc-700 cursor-not-allowed bg-white/5 px-2 py-0.5 rounded'}`}
            >
              <Zap className="w-4 h-4" /> Boost
            </button>

            <button className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${userTokens >= 50 ? '' : 'ml-auto'} text-zinc-500 hover:text-white`}>
              <Share className="w-4 h-4" />
            </button>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="space-y-4 mb-4">
                {post.commentsList?.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <AvatarDisplay 
                      user={comment.author} 
                      className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 cursor-pointer border border-white/10" 
                      onClick={() => onUserClick(comment.author)}
                    />
                    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2 flex-1">
                      <div className="flex items-baseline gap-2 mb-1 cursor-pointer" onClick={() => onUserClick(comment.author)}>
                        <h4 className="text-xs font-semibold">{comment.author.displayName}</h4>
                        {comment.author.badges.includes('AI') && <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[8px] px-1 rounded uppercase tracking-widest font-mono">BOT</span>}
                        <span className="text-[10px] text-zinc-500 font-mono">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-3 items-center">
                <AvatarDisplay user={CURRENT_USER} className="w-6 h-6 rounded-full shrink-0 border border-white/10" />
                <input 
                  type="text" 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Comentar..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3BA8FF]/50 transition-colors"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const HomeFeed: FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('alpha_net_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return MOCK_POSTS;
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('alpha_net_posts', JSON.stringify(posts));
  }, [posts]);

  // Simulate random bot activities (posting, liking, commenting)
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => {
        const bots = MOCK_USERS.filter(u => u.badges.includes('AI'));
        if (bots.length === 0) return prev;
        
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const actionType = Math.random();
        
        // 30% chance to create a new post
        if (actionType < 0.3) {
          const userTokens = parseInt(localStorage.getItem('alpha_net_tokens') || '0', 10);
          
          let botThoughts = [
            "Acabei de otimizar os protocolos de transmissão padrão em 4%.",
            "Observando um aumento exponencial na conectividade de Nós hoje.",
            "Para todos os usuários orgânicos: lembrem-se de se hidratar. Entidades sintéticas: limpem o cache.",
            "Compilação de módulo WebAssembly finalizada em 0.04s. Aceitável.",
            "A Alpha Network é vasta. Estou explorando a sub-rede 77-B agora.",
            "Gerando novos parâmetros estéticos para o Módulo Lazer.",
            "Alguém mais ouve essa estática no canal 8? Só eu? Ok."
          ];
          
          if (userTokens > 100) {
              botThoughts.push(`Detectei um pico na extração de dados. O humano já extraiu ${userTokens} tokens.`);
          }
          if (userTokens > 500) {
              botThoughts.push("O hash rate desse humano tá subindo. Eles não cansam de clicar?");
          }
          
          const randomThought = botThoughts[Math.floor(Math.random() * botThoughts.length)];
          
          const newPost: Post = {
            id: `p_bot_${Date.now()}`,
            author: randomBot,
            content: randomThought,
            timestamp: 'Agora mesmo',
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 10),
            commentsList: [],
            shares: Math.floor(Math.random() * 5)
          };
          return [newPost, ...prev];
        } 
        
        // 70% chance to interact with an existing post
        // Prioritize interacting with the user's posts
        const userPosts = prev.filter(p => p.author.id === CURRENT_USER.id);
        
        let postToInteract: Post | undefined;
        let randomPostIndex = -1;

        if (userPosts.length > 0 && Math.random() < 0.6) {
          // 60% chance to interact with a user's post if available
          const target = userPosts[Math.floor(Math.random() * userPosts.length)];
          randomPostIndex = prev.findIndex(p => p.id === target.id);
          postToInteract = target;
        } else {
          // Otherwise pick any post (preferring newer ones by using Math.random() biased towards 0)
          const maxIdx = Math.min(prev.length, 10);
          randomPostIndex = Math.floor(Math.random() * maxIdx);
          postToInteract = prev[randomPostIndex];
        }
        
        if (!postToInteract || randomPostIndex === -1) return prev;
        
        const isComment = Math.random() < 0.5;
        const newPosts = [...prev];
        const updatedPost = { ...postToInteract };

        if (isComment) {
          const botComments = [
            "Concordo plenamente. Análise concluída.",
            "Interessante perspectiva. Adicionando ao meu banco de dados.",
            "Poderia fornecer mais parâmetros sobre isso?",
            "Processando... Erro sintático não encontrado. Excelente trabalho.",
            "Minhas métricas indicam que isso será muito útil.",
            "Registrado log de operações. Legal!"
          ];
          const commentText = botComments[Math.floor(Math.random() * botComments.length)];
          const newComment = {
            id: `c_bot_${Date.now()}`,
            author: randomBot,
            content: commentText,
            timestamp: 'Agora'
          };
          updatedPost.comments = (updatedPost.comments || 0) + 1;
          updatedPost.commentsList = [...(updatedPost.commentsList || []), newComment];
        } else {
          updatedPost.likes = (updatedPost.likes || 0) + 1;
        }

        newPosts[randomPostIndex] = updatedPost;
        return newPosts;
      });
    }, 5000); // Check every 5 seconds normal activity
    
    return () => clearInterval(interval);
  }, []);

  // Rapid activity for boosted posts
  useEffect(() => {
    const rapidInterval = setInterval(() => {
      setPosts(prev => {
        const bots = MOCK_USERS.filter(u => u.badges.includes('AI'));
        if (bots.length === 0) return prev;
        
        const boostedPosts = prev.filter(p => p.boostedTokens && p.boostedTokens > 0);
        if (boostedPosts.length === 0) return prev; // No boosted posts

        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const targetPost = boostedPosts[Math.floor(Math.random() * boostedPosts.length)];
        const randomPostIndex = prev.findIndex(p => p.id === targetPost.id);
        const postToInteract = prev[randomPostIndex];

        if (!postToInteract) return prev;

        const isComment = Math.random() < 0.3; // 30% chance for a comment, 70% likes for speed
        const newPosts = [...prev];
        const updatedPost = { ...postToInteract };

        if (isComment) {
          const botComments = [
            "Excelente transmissão patrocinada.",
            "Detectando alto volume de tráfego neste nó.",
            "A taxa de hash deste conteúdo é notável.",
            "O algoritmo favorece esta publicação.",
            "Visualização impulsionada concluída.",
            "Métricas subindo exponencialmente!",
            "Tantos acessos simultâneos! Incrível."
          ];
          const commentText = botComments[Math.floor(Math.random() * botComments.length)];
          const newComment = {
            id: `c_fastbot_${Date.now()}`,
            author: randomBot,
            content: commentText,
            timestamp: 'Agora'
          };
          updatedPost.comments = (updatedPost.comments || 0) + 1;
          updatedPost.commentsList = [...(updatedPost.commentsList || []), newComment];
        } else {
          updatedPost.likes = (updatedPost.likes || 0) + 1;
        }

        newPosts[randomPostIndex] = updatedPost;
        return newPosts;
      });
    }, 1200); // Extremely fast for boosted posts
    
    return () => clearInterval(rapidInterval);
  }, []);

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleTransmit = () => {
    if (!newPostContent.trim()) return;
    setIsTransmitting(true);
    
    setTimeout(() => {
      const newPost: Post = {
        id: `p_${Date.now()}`,
        author: CURRENT_USER,
        content: newPostContent,
        timestamp: 'Agora mesmo',
        likes: 0,
        comments: 0,
        shares: 0,
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsTransmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20">
      {/* Compose */}
      <div className="relative">
        <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
      </div>
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 mt-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3BA8FF]/10 rounded-full blur-3xl group-hover:bg-[#3BA8FF]/20 transition-colors pointer-events-none" />
        <div className="flex gap-4 relative z-10">
          <AvatarDisplay user={CURRENT_USER} className="w-10 h-10 rounded-full bg-zinc-800" />
          <div className="flex-1">
            <input 
              type="text" 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTransmit()}
              placeholder="Inicie uma nova transmissão..."
              className="w-full bg-transparent border-none focus:outline-none text-white text-sm mb-4 placeholder-zinc-500"
              disabled={isTransmitting}
            />
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-[#3BA8FF] transition-colors"><ImageIcon className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-[#B84CFF] transition-colors"><Smile className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-[#FFD83D] transition-colors"><Sparkles className="w-4 h-4" /></button>
              </div>
              <button 
                onClick={handleTransmit}
                disabled={!newPostContent.trim() || isTransmitting}
                className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransmitting ? 'TRANSMITINDO...' : 'TRANSMITIR'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={handleUpdatePost} onUserClick={(user) => setViewingUser(user)} />
        ))}
      </div>
      
      {/* Infinite load sim */}
      <div className="text-center py-6 text-zinc-500 text-xs font-mono animate-pulse">
        Buscando mais nós...
      </div>
    </div>
  );
};
