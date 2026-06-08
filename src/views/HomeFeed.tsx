import React, { FC, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { CURRENT_USER as OFFLINE_CURRENT_USER, MOCK_BOTS } from '../data';
import { Heart, MessageSquare, Repeat2, Share, Image as ImageIcon, Smile, Sparkles, Zap, Gift, Coins, Eye, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, User, PostComment } from '../types';
import { UserProfileModal } from '../components/UserProfileModal';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { useOnline } from '../context/OnlineContext';

const PostCard: FC<{ post: Post; onUserClick: (u: User) => void }> = ({ post, onUserClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { likePost, commentPost, boostPost, tokenBalance, isOnline } = useOnline();
  const [comments, setComments] = useState<PostComment[]>([]);

  useEffect(() => {
    if (showComments && (post.commentsList?.length ?? 0) === 0) {
      // Lazy load comments from Firestore if available
      const fetchComments = async () => {
        const commentsQuery = query(collection(db, `posts/${post.id}/comments`), orderBy('createdAt', 'asc'));
        const snap = await getDocs(commentsQuery);
        const fetched: PostComment[] = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            author: d.author,
            content: d.content,
            timestamp: d.createdAt?.toDate?.()?.toLocaleTimeString() || 'Agora'
          };
        });
        setComments(fetched);
      };
      if (isOnline) fetchComments();
    }
  }, [showComments, post.id, isOnline, post.commentsList]);

  const toggleLike = () => {
    likePost(post.id);
  };

  const handleBoost = () => {
    if (tokenBalance >= 50) {
      boostPost(post.id, 50);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    commentPost(post.id, commentText);
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
              {(post.author.badges?.includes('AI') || post.author.badges?.includes('System Bot')) && (
                <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[8px] px-1 rounded uppercase tracking-widest font-mono mt-0.5">BOT</span>
              )}
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
              disabled={tokenBalance < 50}
              title="Impulsionar (Custa 50 Tokens)"
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ml-auto ${tokenBalance >= 50 ? 'text-zinc-500 hover:text-[#FFD83D]' : 'text-zinc-700 cursor-not-allowed bg-white/5 px-2 py-0.5 rounded'}`}
            >
              <Zap className="w-4 h-4" /> Boost
            </button>

            <button className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${tokenBalance >= 50 ? '' : 'ml-auto'} text-zinc-500 hover:text-white`}>
              <Share className="w-4 h-4" />
            </button>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="space-y-4 mb-4">
                {(comments.length > 0 ? comments : (post.commentsList || [])).length > 0 ? (
                  (comments.length > 0 ? comments : (post.commentsList || [])).map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <AvatarDisplay 
                        user={comment.author} 
                        className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 cursor-pointer border border-white/10" 
                        onClick={() => onUserClick(comment.author)}
                      />
                      <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2 flex-1">
                        <div className="flex items-baseline gap-2 mb-1 cursor-pointer" onClick={() => onUserClick(comment.author)}>
                          <h4 className="text-xs font-semibold">{comment.author.displayName}</h4>
                          {(comment.author.badges?.includes('AI') || comment.author.badges?.includes('System Bot')) && (
                            <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[8px] px-1 rounded uppercase tracking-widest font-mono">BOT</span>
                          )}
                          <span className="text-[10px] text-zinc-500 font-mono">{comment.timestamp}</span>
                        </div>
                        <p className="text-xs text-zinc-300">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-600 font-mono pl-1">Silêncio no subcanal, escreva a primeira resposta.</p>
                )}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-3 items-center">
                <AvatarDisplay user={post.author} className="w-6 h-6 rounded-full shrink-0 border border-white/10" />
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
  const { posts, createPost, isOnline, giftLogs, currentUser } = useOnline();
  const [newPostContent, setNewPostContent] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const handleTransmit = async () => {
    if (!newPostContent.trim()) return;
    setIsTransmitting(true);
    try {
      await createPost(newPostContent);
      setNewPostContent('');
    } catch (e) {
      console.error('Transmission failed:', e);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 px-1 sm:px-2 flex flex-col lg:flex-row gap-6">
      
      {/* Prime User Modal */}
      <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />

      {/* Main Broadcast Module */}
      <div className="flex-1">
        {/* Compose Post */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3BA8FF]/10 rounded-full blur-3xl group-hover:bg-[#3BA8FF]/20 transition-colors pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <AvatarDisplay user={currentUser} className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 shrink-0" />
            <div className="flex-1">
              <input 
                type="text" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTransmit()}
                placeholder={isOnline ? "Inicie uma transmissão real no grid online..." : "Inicie uma simulação de transmissão..."}
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

        {/* FEED SEPARATOR OR STATUS BADGE */}
        <div className="p-3 mb-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#A5E600]' : 'bg-amber-500'} animate-pulse`} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              MODO OPERACIONAL: {isOnline ? 'CONEXÃO CENTRAL SATÉLITE' : 'SIMULATION LOCAL (SINTÉTICOS)'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-600 hidden md:block">TRANSMISSÃO CRIPTOGRAFADA</span>
        </div>

        {/* Feed Posts */}
        <div className="flex flex-col">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} onUserClick={(user) => setViewingUser(user)} />
            ))
          ) : (
            <div className="text-center py-10 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-zinc-500 font-mono">
              <Terminal className="w-8 h-8 opacity-45 mb-3" />
              <p className="text-xs">Nenhuma transmissão encontrada neste canal.</p>
              <p className="text-[10px] text-zinc-600 mt-1">Conecte sua satélite ou seja o primeiro a iniciar uma transmissão!</p>
            </div>
          )}
        </div>
        
        {/* Infinite loading display */}
        <div className="text-center py-6 text-zinc-600 text-[10px] font-mono tracking-wider animate-pulse">
          AUDITANDO SINAL DE RELÉS...
        </div>
      </div>

      {/* RIGHT WIDGET: Gift log panel and online users */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Real-time users connected right now */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
          <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#3BA8FF] rounded-full animate-ping" />
            NÓS EM ATIVIDADE {isOnline ? 'REAL' : '(AI)'}
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono mb-4 leadings-tight">Clique nos nós ativos para visitá-los e ofertar presentes!</p>

          <div className="space-y-3">
            {isOnline ? (
              posts.length > 0 ? (
                // Extract unique author ids
                Array.from(new Set(posts.map(p => p.author.id)))
                  .map(uid => posts.find(p => p.author.id === uid)?.author)
                  .filter(Boolean)
                  .filter(author => !author?.badges?.some(b => b === 'AI' || b === 'System Bot'))
                  .slice(0, 6)
                  .map(nodeUser => (
                    <div 
                      key={nodeUser!.id}
                      onClick={() => setViewingUser(nodeUser!)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <AvatarDisplay user={nodeUser!} className="w-7 h-7 rounded-lg border border-white/10 bg-zinc-900" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-100 truncate leading-snug">{nodeUser!.displayName}</p>
                        <p className="text-[9px] font-mono text-[#3BA8FF] truncate leading-none">{nodeUser!.username}</p>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A5E600] shrink-0 shadow-[0_0_8px_#A5E600]" />
                    </div>
                  ))
              ) : (
                <div className="py-2 text-[10px] font-mono text-zinc-650">Carregando nós adjacentes...</div>
              )
            ) : (
              MOCK_BOTS.map(botUser => (
                <div 
                  key={botUser.id}
                  onClick={() => setViewingUser(botUser)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
                >
                  <AvatarDisplay user={botUser} className="w-7 h-7 rounded-ly-sm border border-white/10 bg-zinc-900" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-100 truncate leading-snug">{botUser.displayName}</p>
                    <p className="text-[9px] font-mono text-[#B84CFF] truncate leading-none">{botUser.username}</p>
                  </div>
                  <span className="text-[8px] bg-[#B84CFF]/10 text-[#B84CFF] font-mono px-1 py-0.5 rounded tracking-widest uppercase shrink-0">BOT</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Central Audit Gifts Log */}
        <div className="bg-[#B84CFF]/5 border border-[#B84CFF]/20 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B84CFF]/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 relative z-10 text-[#B84CFF]">
            <Gift className="w-4 h-4 text-[#B84CFF] animate-pulse" />
            REGISTRO DE PRESENTES
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono mb-4 leading-tight relative z-10">Histórico de transferências de fichas e pacotes de upgrade na malha da rede.</p>

          <div className="space-y-3 max-h-64 overflow-y-auto custom-scroll pr-1 relative z-10">
            {giftLogs.length > 0 ? (
              giftLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-black/40 border border-[#B84CFF]/10 p-2.5 rounded-xl text-[10px] leading-tight"
                >
                  <div className="flex justify-between font-mono text-[8px] text-zinc-500 mb-1">
                    <span>TRANSAÇÃO GRÁFICA</span>
                    <span>ATALHO</span>
                  </div>
                  <p className="text-zinc-200">
                    <span className="font-semibold text-[#3BA8FF]">{log.senderName}</span> enviou um{' '}
                    <span className="text-[#A5E600] font-semibold">"{log.giftType}"</span> para{' '}
                    <span className="font-semibold text-[#FFD83D]">{log.receiverName}</span>.
                  </p>
                  <div className="mt-1 flex items-center gap-1 font-mono text-[9px] text-[#A5E600]">
                    <Coins className="w-3 h-3 text-[#A5E600]" />
                    <span>+{log.amount} Tokens transferidos</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center opacity-40 font-mono">
                <Gift className="w-6 h-6 mb-2 text-zinc-500" />
                <p className="text-[9px] text-zinc-650">Nenhum registro de presentes captado recentemente.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
