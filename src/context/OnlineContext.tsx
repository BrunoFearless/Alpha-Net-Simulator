import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  runTransaction,
  increment,
  where
} from 'firebase/firestore';
import { User, Post, PostComment, AppNotification } from '../types';
import { CURRENT_USER as OFFLINE_CURRENT_USER, MOCK_USERS } from '../data';

interface OnlineContextType {
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  user: User | null;
  currentUser: User; // Returns logged-in user if online, otherwise OFFLINE_CURRENT_USER
  onlineUsers: User[];
  posts: Post[];
  messages: any[];
  notifications: AppNotification[];
  createNotification: (userId: string, type: 'message' | 'comment' | 'like' | 'follow' | 'system', content: string, relatedId?: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  tokenBalance: number;
  addTokens: (amount: number) => Promise<void>;
  deductTokens: (amount: number) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  createPost: (content: string, media?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, content: string) => Promise<void>;
  boostPost: (postId: string, amount: number) => Promise<void>;
  sendGift: (receiverId: string, receiverName: string, amount: number, giftType: string) => Promise<boolean>;
  sendDirectMessage: (receiverId: string, content: string) => Promise<void>;
  giftLogs: any[];
  authError: string | null;
  setAuthError: (val: string | null) => void;
  isSimulated: boolean;
  loginAsSimulated: () => void;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (val: boolean) => void;
  updateProfile: (displayName: string, bio: string) => Promise<void>;
}

const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

export const useOnline = () => {
  const context = useContext(OnlineContext);
  if (!context) throw new Error('useOnline must be used within an OnlineProvider');
  return context;
};

export const OnlineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Option to switch network
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return localStorage.getItem('alpha_net_network_mode') === 'online';
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [giftLogs, setGiftLogs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('alpha_net_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
      } catch (e) {}
    }
    return [];
  });

  // Track notifications preference in localStorage
  useEffect(() => {
    localStorage.setItem('alpha_net_notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Tokens loaded dynamically
  const [tokenBalance, setTokenBalance] = useState<number>(() => {
    return parseInt(localStorage.getItem('alpha_net_tokens') || '100', 10);
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(() => {
    return localStorage.getItem('alpha_net_is_simulated') === 'true';
  });

  // Track isSimulated preference in localStorage
  useEffect(() => {
    localStorage.setItem('alpha_net_is_simulated', isSimulated ? 'true' : 'false');
  }, [isSimulated]);

  // Track isOnline preference in localStorage
  useEffect(() => {
    localStorage.setItem('alpha_net_network_mode', isOnline ? 'online' : 'offline');
  }, [isOnline]);

  // Synchronize token state dynamically
  useEffect(() => {
    const handleStorage = () => {
      if (!isOnline) {
        setTokenBalance(parseInt(localStorage.getItem('alpha_net_tokens') || '100', 10));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isOnline]);

  // Handle Redirect Result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setIsSimulated(false);
          setIsOnline(true);
        }
      })
      .catch((error: any) => {
        console.warn('Redirect authentication failed (expected if non-redirect load): ', error);
        setAuthError(error?.message || 'Falha na autenticação por redirecionamento.');
      });
  }, []);

  // Subscribe to Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setIsOnline(true);
        // Sync or register user profile document in Firestore
        const userRef = doc(db, 'users', fUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const loadedUser: User = {
              id: fUser.uid,
              username: data.username || `@${fUser.displayName?.toLowerCase().replace(/\s+/g, '') || 'entity'}`,
              displayName: data.displayName || fUser.displayName || 'No Name',
              avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fUser.uid}&backgroundColor=0A0A0B`,
              bio: data.bio || 'Membro operacional da Alpha Online.',
              followers: data.followers || 0,
              following: data.following || 0,
              badges: data.badges || ['Pioneer Entity'],
              avatarConfig: data.avatarConfig || OFFLINE_CURRENT_USER.avatarConfig
            };
            setUser(loadedUser);
            setTokenBalance(data.tokens ?? 100);
            localStorage.setItem('alpha_net_tokens', (data.tokens ?? 100).toString());
          } else {
            // First time user registration
            const initialTokens = parseInt(localStorage.getItem('alpha_net_tokens') || '100', 10);
            const newUser: User = {
              id: fUser.uid,
              username: `@${fUser.displayName?.toLowerCase().replace(/\s+/g, '') || 'entity'}`,
              displayName: fUser.displayName || 'Neo Voyager',
              avatar: fUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fUser.uid}&backgroundColor=0A0A0B`,
              bio: 'Iniciando minha conexão com a rede Alpha.',
              followers: 12,
              following: 5,
              badges: ['Pioneer Entity'],
              avatarConfig: OFFLINE_CURRENT_USER.avatarConfig
            };

            await setDoc(userRef, {
              ...newUser,
              tokens: initialTokens,
              createdAt: serverTimestamp()
            });

            setUser(newUser);
            setTokenBalance(initialTokens);
          }
        } catch (error: any) {
          const errMsg = error?.message || String(error);
          const isOfflineError = errMsg.includes('offline') || 
                                 errMsg.includes('Could not reach Cloud Firestore') ||
                                 errMsg.includes('unavailable') ||
                                 errMsg.includes('network') ||
                                 error?.code === 'unavailable';

          if (isOfflineError) {
            console.warn('Firestore is currently offline. Transitioning to cached offline profile state.');
            const fallbackUser: User = {
              id: fUser.uid,
              username: `@${fUser.displayName?.toLowerCase().replace(/\s+/g, '') || 'entity'}`,
              displayName: fUser.displayName || 'Neo Voyager',
              avatar: fUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fUser.uid}&backgroundColor=0A0A0B`,
              bio: 'Operando localmente (sem sincronização de perfil ativa devido a conexões offline).',
              followers: 12,
              following: 5,
              badges: ['Pioneer Entity'],
              avatarConfig: OFFLINE_CURRENT_USER.avatarConfig
            };
            setUser(fallbackUser);
            setAuthError('Sua sessão está ativa localmente, mas não conseguimos nos comunicar com o servidor Firestore (o cliente está offline). Seu progresso será salvo localmente.');
          } else {
            console.warn('Error syncing user info (non-fatal): ', error);
            try {
              handleFirestoreError(error, OperationType.GET, `users/${fUser.uid}`);
            } catch (e) {}
          }
        }
      } else {
        const wasSimulated = localStorage.getItem('alpha_net_is_simulated') === 'true';
        if (wasSimulated) {
          const saved = localStorage.getItem('alpha_net_profile');
          let localProfile = { displayName: OFFLINE_CURRENT_USER.displayName, bio: OFFLINE_CURRENT_USER.bio };
          if (saved) {
            try {
              localProfile = JSON.parse(saved);
            } catch (ev) {}
          }
          setUser({
            id: 'simulated_operator_101',
            username: OFFLINE_CURRENT_USER.username,
            displayName: localProfile.displayName || OFFLINE_CURRENT_USER.displayName,
            avatar: OFFLINE_CURRENT_USER.avatar,
            bio: localProfile.bio || 'Operando via conexão quântica simulada.',
            followers: 404,
            following: 200,
            badges: ['Synthetic Node', 'Pioneer Entity'],
            avatarConfig: OFFLINE_CURRENT_USER.avatarConfig
          });
        } else {
          setUser(null);
        }
        // Load default offline token balance
        setTokenBalance(parseInt(localStorage.getItem('alpha_net_tokens') || '100', 10));
      }
    });

    return unsubscribe;
  }, []);

  // Sync users' real-time token state online
  useEffect(() => {
    if (isOnline && firebaseUser && !isSimulated) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const unsubscribe = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.tokens !== undefined) {
            setTokenBalance(data.tokens);
            localStorage.setItem('alpha_net_tokens', data.tokens.toString());
          }
        }
      });
      return unsubscribe;
    }
  }, [isOnline, firebaseUser]);

  // Load online users
  useEffect(() => {
    if (isOnline && !isSimulated) {
      const q = query(collection(db, 'users'), limit(50));
      const unsubscribe = onSnapshot(q, (snap) => {
        const list: User[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            username: data.username,
            displayName: data.displayName,
            avatar: data.avatar,
            bio: data.bio || '',
            followers: data.followers || 0,
            following: data.following || 0,
            badges: data.badges || [],
          });
        });
        setOnlineUsers(list);
      }, (error) => {
        const errMsg = error?.message || String(error);
        const isOffline = errMsg.includes('offline') || error?.code === 'unavailable';
        if (isOffline) {
          console.warn('Firestore is offline, falling back to mock users list.');
          setOnlineUsers(MOCK_USERS);
        } else {
          try {
            handleFirestoreError(error, OperationType.LIST, 'users');
          } catch (e: any) {
            if (errMsg.toLowerCase().includes('permission') || error?.code === 'permission-denied') {
              throw e;
            }
          }
        }
      });
      return unsubscribe;
    } else {
      setOnlineUsers(MOCK_USERS);
    }
  }, [isOnline, isSimulated]);

  // Fetch real-time feed posts or fallback to local simulated feed
  useEffect(() => {
    if (isOnline && !isSimulated) {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
      const unsubscribe = onSnapshot(postsQuery, async (snap) => {
        const postsList: Post[] = [];
        
        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          
          postsList.push({
            id: docSnap.id,
            author: data.author,
            content: data.content,
            media: data.media,
            likes: data.likes || 0,
            comments: data.comments || 0,
            shares: data.shares || 0,
            boostedTokens: data.boostedTokens || 0,
            timestamp: data.createdAt ? 'Transmissão Real-time' : 'Carregando...',
            commentsList: [] // Comments will be fetched inside Post component or lazy-loaded
          });
        }
        setPosts(postsList);
      }, (error) => {
        console.warn('Error fetching online posts, fallback enabled...', error);
        const saved = localStorage.getItem('alpha_net_posts');
        if (saved) {
          try {
            setPosts(JSON.parse(saved));
          } catch (e) {
            setPosts([]);
          }
        }
      });
      return unsubscribe;
    } else {
      // Offline fallback state loaded from local feed
      const saved = localStorage.getItem('alpha_net_posts');
      if (saved) {
        try {
          setPosts(JSON.parse(saved));
        } catch (e) {
          setPosts([]);
        }
      }
    }
  }, [isOnline, isSimulated]);

  // Sync Gifts (Real-time Transaction log)
  useEffect(() => {
    if (isOnline && !isSimulated) {
      const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'), limit(30));
      const unsubscribe = onSnapshot(q, (snap) => {
        const logs: any[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          logs.push({
            id: docSnap.id,
            ...d,
            createdAt: d.createdAt?.toDate?.() || new Date()
          });
        });
        setGiftLogs(logs);
      }, (error) => {
        console.warn('Silent gifts snapshot error (expected if offline):', error);
      });
      return unsubscribe;
    }
  }, [isOnline, isSimulated]);

  // Load real-time messages between users from Firestore
  useEffect(() => {
    if (isOnline && firebaseUser && !isSimulated) {
      let sentMsgs: any[] = [];
      let recvMsgs: any[] = [];

      const mergeAndSet = () => {
        const merged = [...sentMsgs, ...recvMsgs];
        const unique: Record<string, any> = {};
        for (const m of merged) {
          unique[m.id] = m;
        }
        const sorted = Object.values(unique).sort((a: any, b: any) => {
          return a._time - b._time;
        });
        setMessages(sorted);
      };

      const qSent = query(
        collection(db, 'messages'),
        where('senderId', '==', firebaseUser.uid)
      );
      const qRecv = query(
        collection(db, 'messages'),
        where('receiverId', '==', firebaseUser.uid)
      );

      const unsubscribeSent = onSnapshot(qSent, (snap) => {
        sentMsgs = snap.docs.map(docSnap => {
          const d = docSnap.data();
          const date = d.createdAt?.toDate?.() || new Date();
          return {
            id: docSnap.id,
            senderId: d.senderId,
            receiverId: d.receiverId,
            content: d.content,
            createdAt: d.createdAt ? date : new Date(),
            _time: date.getTime()
          };
        });
        mergeAndSet();
      }, (err) => {
        console.warn("Silent messages (sent) listener error:", err);
      });

      const unsubscribeRecv = onSnapshot(qRecv, (snap) => {
        recvMsgs = snap.docs.map(docSnap => {
          const d = docSnap.data();
          const date = d.createdAt?.toDate?.() || new Date();
          return {
            id: docSnap.id,
            senderId: d.senderId,
            receiverId: d.receiverId,
            content: d.content,
            createdAt: d.createdAt ? date : new Date(),
            _time: date.getTime()
          };
        });
        mergeAndSet();
      }, (err) => {
        console.warn("Silent messages (received) listener error:", err);
      });

      return () => {
        unsubscribeSent();
        unsubscribeRecv();
      };
    } else {
      setMessages([]);
    }
  }, [isOnline, firebaseUser, isSimulated]);

  // Load real-time notifications from Firestore
  useEffect(() => {
    if (isOnline && firebaseUser && !isSimulated) {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', firebaseUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const list = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: d.userId,
            type: d.type,
            senderId: d.senderId,
            senderName: d.senderName,
            content: d.content,
            relatedId: d.relatedId,
            read: d.read || false,
            createdAt: d.createdAt?.toDate?.() || new Date()
          } as AppNotification;
        });
        // Client-side sort to avoid index requirements
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setNotifications(list);
      }, (err) => {
        console.warn("Silent notifications listener error:", err);
      });

      return () => unsubscribe();
    }
  }, [isOnline, firebaseUser, isSimulated]);

  // Authenticate using Google popup
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsSimulated(false);
    } catch (e: any) {
      console.warn('Google authorization failed:', e);
      if (e?.code === 'auth/cancelled-popup-request' || e?.code === 'auth/popup-blocked' || e?.message?.includes('cancelled-popup')) {
        setAuthError('O login por popup do Google falhou pois ele foi cancelado ou bloqueado pelo navegador (comum em sandboxes/iframes). Para autenticar via conta Google real, use o botão de Nova Aba no canto do editor, ou prossiga imediatamente com uma Conexão Simulada.');
      } else {
        setAuthError(e?.message || 'Falha na autenticação do Google.');
      }
    }
  };

  // Authenticate using Google redirect (bypass popup blocker)
  const loginWithGoogleRedirect = async () => {
    setAuthError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (e: any) {
      console.warn('Google redirect failed:', e);
      setAuthError(e?.message || 'Falha no redirecionamento do Google.');
    }
  };

  const loginAsSimulated = () => {
    setIsSimulated(true);
    setIsOnline(true);
    setAuthError(null);
    setIsConnectModalOpen(false);
    
    const saved = localStorage.getItem('alpha_net_profile');
    let localProfile = { displayName: OFFLINE_CURRENT_USER.displayName, bio: OFFLINE_CURRENT_USER.bio };
    if (saved) {
      try {
        localProfile = JSON.parse(saved);
      } catch (ev) {}
    }

    setUser({
      id: 'simulated_operator_101',
      username: OFFLINE_CURRENT_USER.username,
      displayName: localProfile.displayName || OFFLINE_CURRENT_USER.displayName,
      avatar: OFFLINE_CURRENT_USER.avatar,
      bio: localProfile.bio || 'Operando via conexão quântica simulada.',
      followers: 404,
      following: 200,
      badges: ['Synthetic Node', 'Pioneer Entity'],
      avatarConfig: OFFLINE_CURRENT_USER.avatarConfig
    });
  };

  // Sign out of Google / Reset Simulated Session
  const logout = async () => {
    try {
      if (!isSimulated) {
        await signOut(auth);
      }
      setIsOnline(false);
      setIsSimulated(false);
      setUser(null);
      setAuthError(null);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  // Resolve current active user profile reference
  const currentUser: User = isOnline && user ? user : OFFLINE_CURRENT_USER;

  // Add tokens locally / cloud-synchronized
  const addTokens = async (amount: number) => {
    if (isOnline && firebaseUser && !isSimulated) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      try {
        await updateDoc(userRef, {
          tokens: increment(amount)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    } else {
      const nextBalance = tokenBalance + amount;
      setTokenBalance(nextBalance);
      localStorage.setItem('alpha_net_tokens', nextBalance.toString());
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Deduct tokens
  const deductTokens = async (amount: number): Promise<boolean> => {
    if (isOnline && firebaseUser && !isSimulated) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      try {
        let success = false;
        await runTransaction(db, async (transaction) => {
          const userSnap = await transaction.get(userRef);
          if (!userSnap.exists()) return;
          const currentTokens = userSnap.data().tokens || 0;
          if (currentTokens >= amount) {
            transaction.update(userRef, { tokens: currentTokens - amount });
            success = true;
          }
        });
        return success;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}`);
        return false;
      }
    } else {
      const cur = parseInt(localStorage.getItem('alpha_net_tokens') || '100', 10);
      if (cur >= amount) {
        const next = cur - amount;
        setTokenBalance(next);
        localStorage.setItem('alpha_net_tokens', next.toString());
        window.dispatchEvent(new Event('storage'));
        return true;
      }
      return false;
    }
  };

  // Broadcast Feed post
  const createPost = async (content: string, media?: string) => {
    if (isOnline && firebaseUser && user && !isSimulated) {
      try {
        const postCollection = collection(db, 'posts');
        const docId = `posts_${Date.now()}`;
        await setDoc(doc(postCollection, docId), {
          id: docId,
          authorId: firebaseUser.uid,
          author: {
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            avatar: user.avatar,
            badges: user.badges || []
          },
          content,
          media: media || '',
          likes: 0,
          comments: 0,
          shares: 0,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'posts');
      }
    } else {
      const offlinePost: Post = {
        id: `p_${Date.now()}`,
        author: currentUser,
        content,
        media,
        timestamp: 'Agora mesmo',
        likes: 0,
        comments: 0,
        shares: 0,
      };
      const nextPosts = [offlinePost, ...posts];
      setPosts(nextPosts);
      localStorage.setItem('alpha_net_posts', JSON.stringify(nextPosts));
    }
  };

  // Like a post
  const likePost = async (postId: string) => {
    if (isOnline && firebaseUser && !isSimulated) {
      const likeDocRef = doc(db, `posts/${postId}/likes`, firebaseUser.uid);
      const postRef = doc(db, 'posts', postId);
      try {
        const likeSnap = await getDoc(likeDocRef);
        const targetPost = posts.find(p => p.id === postId);
        if (likeSnap.exists()) {
          // Unlike
          await runTransaction(db, async (trans) => {
            trans.delete(likeDocRef);
            trans.update(postRef, { likes: increment(-1) });
          });
        } else {
          // Like
          await runTransaction(db, async (trans) => {
            trans.set(likeDocRef, { likedAt: serverTimestamp() });
            trans.update(postRef, { likes: increment(1) });
          });
          if (targetPost && targetPost.author.id !== currentUser.id) {
            createNotification(
              targetPost.author.id,
              'like',
              'curtiu o seu post',
              postId
            ).catch(err => console.warn('Failed like notification:', err));
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `posts/${postId}/likes`);
      }
    } else {
      // Offline mode toggling like
      const targetPost = posts.find(p => p.id === postId);
      const updated = posts.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          const nextLikes = nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
          return { ...p, isLiked: nextLiked, likes: nextLikes };
        }
        return p;
      });
      setPosts(updated);
      localStorage.setItem('alpha_net_posts', JSON.stringify(updated));

      if (targetPost && !targetPost.isLiked && targetPost.author.id !== currentUser.id) {
        createNotification(
          targetPost.author.id,
          'like',
          'curtiu o seu post',
          postId
        ).catch(err => console.warn('Failed offline like notification:', err));
      }
    }
  };

  // Comment on a post
  const commentPost = async (postId: string, content: string) => {
    if (isOnline && firebaseUser && user && !isSimulated) {
      try {
        const commentRef = doc(collection(db, `posts/${postId}/comments`));
        const targetPost = posts.find(p => p.id === postId);
        await runTransaction(db, async (trans) => {
          trans.set(commentRef, {
            id: commentRef.id,
            postId,
            authorId: firebaseUser.uid,
            author: {
              id: user.id,
              displayName: user.displayName,
              username: user.username,
              avatar: user.avatar,
              badges: user.badges || []
            },
            content,
            createdAt: serverTimestamp()
          });
          trans.update(doc(db, 'posts', postId), { comments: increment(1) });
        });

        // Update local state immediately
        const newComment: PostComment = {
          id: commentRef.id,
          author: {
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            avatar: user.avatar,
            badges: user.badges || []
          },
          content,
          timestamp: 'Agora mesmo'
        };
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments + 1,
              commentsList: [...(p.commentsList || []), newComment]
            };
          }
          return p;
        }));

        if (targetPost && targetPost.author.id !== currentUser.id) {
          createNotification(
            targetPost.author.id,
            'comment',
            `comentou no seu post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            postId
          ).catch(err => console.warn('Failed comment notification:', err));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `posts/${postId}/comments`);
      }
    } else {
      // Offline comment write
      const targetPost = posts.find(p => p.id === postId);
      const updated = posts.map(p => {
        if (p.id === postId) {
          const newComment: PostComment = {
            id: `c_${Date.now()}`,
            author: currentUser,
            content,
            timestamp: 'Agora mesmo'
          };
          return {
            ...p,
            comments: p.comments + 1,
            commentsList: [...(p.commentsList || []), newComment]
          };
        }
        return p;
      });
      setPosts(updated);
      localStorage.setItem('alpha_net_posts', JSON.stringify(updated));

      if (targetPost && targetPost.author.id !== currentUser.id) {
        createNotification(
          targetPost.author.id,
          'comment',
          `comentou no seu post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          postId
        ).catch(err => console.warn('Failed offline comment notification:', err));
      }
    }
  };

  // Promote post
  const boostPost = async (postId: string, amount: number) => {
    const success = await deductTokens(amount);
    if (success) {
      if (isOnline && !isSimulated) {
        try {
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            boostedTokens: increment(amount)
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
        }
      } else {
        const updated = posts.map(p => {
          if (p.id === postId) {
            return { ...p, boostedTokens: (p.boostedTokens || 0) + amount };
          }
          return p;
        });
        setPosts(updated);
        localStorage.setItem('alpha_net_posts', JSON.stringify(updated));
      }
    }
  };

  // Gifting implementation "oferecer tokens, dar presentes"
  const sendGift = async (receiverId: string, receiverName: string, amount: number, giftType: string): Promise<boolean> => {
    if (isOnline && firebaseUser && user && !isSimulated) {
      if (receiverId === firebaseUser.uid) {
        alert('Você não pode enviar presentes para si mesmo.');
        return false;
      }
      const selfRef = doc(db, 'users', firebaseUser.uid);
      const targetRef = doc(db, 'users', receiverId);
      const giftDocRef = doc(collection(db, 'gifts'));

      try {
        let valid = false;
        await runTransaction(db, async (trans) => {
          const selfSnap = await trans.get(selfRef);
          if (!selfSnap.exists()) return;
          const balance = selfSnap.data().tokens || 0;
          if (balance >= amount) {
            trans.update(selfRef, { tokens: balance - amount });
            trans.update(targetRef, { tokens: increment(amount) });
            trans.set(giftDocRef, {
              id: giftDocRef.id,
              senderId: firebaseUser.uid,
              senderName: user.displayName,
              receiverId,
              receiverName,
              amount,
              giftType,
              createdAt: serverTimestamp()
            });
            valid = true;
          }
        });
        return valid;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'gifts');
        return false;
      }
    } else {
      // Local simulated transfer
      const success = await deductTokens(amount);
      if (success) {
        const giftLog = {
          id: `gift_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.displayName,
          receiverId,
          receiverName,
          amount,
          giftType,
          createdAt: new Date()
        };
        setGiftLogs(prev => [giftLog, ...prev]);
        return true;
      }
      return false;
    }
  };

  // Direct Message Transmission
  const sendDirectMessage = async (receiverId: string, content: string) => {
    if (isOnline && firebaseUser && !isSimulated) {
      const msgCol = collection(db, 'messages');
      const docId = `msg_${Date.now()}`;
      try {
        await setDoc(doc(msgCol, docId), {
          id: docId,
          senderId: firebaseUser.uid,
          receiverId,
          content,
          createdAt: serverTimestamp()
        });
        
        // Dispatch notification
        createNotification(receiverId, 'message', content, docId).catch((err) => {
          console.warn('Failed to dispatch message notification to Firestore: ', err);
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'messages');
      }
    } else {
      // Offline direct message mock
      createNotification(receiverId, 'message', content).catch((err) => {
        console.warn('Failed offline message notification trigger:', err);
      });
    }
  };

  // Create dynamic interaction alerts/notifications
  const createNotification = async (
    targetUserId: string,
    type: 'message' | 'comment' | 'like' | 'follow' | 'system',
    content: string,
    relatedId?: string
  ) => {
    const sender = currentUser;
    const notificationId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (isOnline && firebaseUser && !isSimulated) {
      try {
        const notifRef = doc(db, 'notifications', notificationId);
        await setDoc(notifRef, {
          id: notificationId,
          userId: targetUserId,
          type,
          senderId: sender.id,
          senderName: sender.displayName,
          content,
          relatedId: relatedId || '',
          read: false,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `notifications/${notificationId}`);
      }
    } else {
      // Local/simulated path
      const newNotif: AppNotification = {
        id: notificationId,
        userId: targetUserId,
        type,
        senderId: sender.id,
        senderName: sender.displayName,
        content,
        relatedId: relatedId || '',
        read: false,
        createdAt: new Date()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Mark specific notification as read
  const markNotificationAsRead = async (id: string) => {
    if (isOnline && firebaseUser && !isSimulated) {
      try {
        const notifRef = doc(db, 'notifications', id);
        await updateDoc(notifRef, { read: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
      }
    } else {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  // Mark all notifications as read at once
  const markAllNotificationsAsRead = async () => {
    if (isOnline && firebaseUser && !isSimulated) {
      try {
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
          const notifRef = doc(db, 'notifications', n.id);
          await updateDoc(notifRef, { read: true });
        }
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    } else {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  // Synchronize system profile edits across all tiers (Firestore / Local state / persistent localStorage)
  const updateProfile = async (displayName: string, bio: string) => {
    const saved = localStorage.getItem('alpha_net_profile');
    let localProfile = {};
    if (saved) {
      try {
        localProfile = JSON.parse(saved);
      } catch (e) {}
    }
    const updatedProfile = { ...localProfile, displayName, bio };
    localStorage.setItem('alpha_net_profile', JSON.stringify(updatedProfile));

    // Update global fallback
    OFFLINE_CURRENT_USER.displayName = displayName;
    OFFLINE_CURRENT_USER.bio = bio;

    if (isOnline && firebaseUser && !isSimulated) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      try {
        await updateDoc(userRef, { displayName, bio });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }

    // Always keep context user state updated in real-time
    if (user) {
      setUser(prev => prev ? { ...prev, displayName, bio } : null);
    }
  };

  return (
    <OnlineContext.Provider value={{
      isOnline,
      setIsOnline,
      user,
      currentUser,
      onlineUsers,
      posts,
      messages,
      tokenBalance,
      addTokens,
      deductTokens,
      loginWithGoogle,
      loginWithGoogleRedirect,
      logout,
      createPost,
      likePost,
      commentPost,
      boostPost,
      sendGift,
      sendDirectMessage,
      giftLogs,
      authError,
      setAuthError,
      isSimulated,
      loginAsSimulated,
      isConnectModalOpen,
      setIsConnectModalOpen,
      updateProfile
    }}>
      {children}
    </OnlineContext.Provider>
  );
};
