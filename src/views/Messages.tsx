import { FC, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MOCK_USERS } from '../data';
import { Send, Phone, Video, Search, MoreVertical, Plus, ChevronLeft, X, Users, MessageSquare } from 'lucide-react';
import { UserProfileModal } from '../components/UserProfileModal';
import { User } from '../types';
import { useOnline } from '../context/OnlineContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  text: string;
  isSender: boolean;
  time: string;
}

export const MessagesView: FC = () => {
  const { onlineUsers, currentUser, isOnline, isSimulated, sendDirectMessage, messages } = useOnline();

  // Local state for the Network Users modal
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');

  // Active chat IDs list (dynamic local sync)
  const [activeChatsList, setActiveChatsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('alpha_net_active_chats_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return []; // Starts empty without bots/mockups based on user request
  });

  // Track activeChatsList preference in localStorage
  useEffect(() => {
    localStorage.setItem('alpha_net_active_chats_list', JSON.stringify(activeChatsList));
  }, [activeChatsList]);

  // Selected active chat ID
  const [activeChat, setActiveChat] = useState<string>(() => {
    const savedList = localStorage.getItem('alpha_net_active_chats_list');
    if (savedList) {
      try {
        const parsed = JSON.parse(savedList);
        if (parsed.length > 0) return parsed[0];
      } catch (e) {}
    }
    return '';
  });

  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  // Local state directory of messages per user ID (used for simulated connection)
  const [messagesDB, setMessagesDB] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('alpha_net_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {}; // Starts empty without bots/mockups
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_messages', JSON.stringify(messagesDB));
  }, [messagesDB]);

  // Utility to find user by ID in either custom onlineUsers list or default fallback
  const findUserById = (id: string): User | undefined => {
    return onlineUsers.find((u) => u.id === id) || MOCK_USERS.find((u) => u.id === id);
  };

  const activeUser = findUserById(activeChat);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get active messages based on mode: Firestore (real-time active users) or messagesDB (simulated)
  const activeMessages = (() => {
    if (isOnline && !isSimulated) {
      if (!activeChat) return [];
      const filtered = (messages || []).filter(m => 
        (m.senderId === currentUser.id && m.receiverId === activeChat) ||
        (m.senderId === activeChat && m.receiverId === currentUser.id)
      );
      return filtered.map((m): ChatMessage => ({
        id: m.id,
        text: m.content,
        isSender: m.senderId === currentUser.id,
        time: m.createdAt instanceof Date ? m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ativo'
      }));
    } else {
      return activeChat ? (messagesDB[activeChat] || []) : [];
    }
  })();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  const handleSend = async () => {
    if (!inputMessage.trim() || !activeChat) return;

    const textToSend = inputMessage;
    const currentChatId = activeChat;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!isOnline || isSimulated) {
      setMessagesDB(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), newMessage]
      }));
    }
    
    setInputMessage('');

    if (isOnline && !isSimulated) {
      try {
        await sendDirectMessage(currentChatId, textToSend);
      } catch (e) {
        console.error('Failed to dispatch real-time message payload:', e);
      }
    }

    const activeUserObj = findUserById(currentChatId);
    const isBot = activeUserObj?.badges.includes('AI') || false;

    // Trigger an AI simulated bot response or offline response:
    // Only simulate if:
    // - The counter-party has the 'AI' badge (both in simulation or real connection)
    // - OR if we are fully offline/simulated connection.
    const shouldMockReply = isBot || (!isOnline || isSimulated);

    if (shouldMockReply) {
      setIsTyping(true);

      setTimeout(() => {
        let replyText = 'Conexão estabelecida. Recebido parâmetros via uplink Alpha Net.';
        const loweredInput = textToSend.toLowerCase();
        
        if (isBot) {
          if (loweredInput.includes('olá') || loweredInput.includes('oi') || loweredInput.includes('ei')) {
            replyText = `Saudações, humano. Como ${activeUserObj?.displayName} pode ajudá-lo hoje?`;
          } else if (loweredInput.includes('?')) {
            replyText = 'Analisando probabilidades... Meus conjuntos de dados quânticos e simulações sugerem que 42 continua sendo a resposta universal.';
          } else if (loweredInput.includes('codigo') || loweredInput.includes('bug') || loweredInput.includes('erro') || loweredInput.includes('código')) {
            replyText = 'O problema de pipeline detectado pode estar relacionado a parâmetros de rede. Recomendo analisar os blocos de estado locais.';
          } else if (loweredInput.includes('obrigad')) {
            replyText = `De nada. Sempre operacional para cooperar nas diretrizes de rede da Alpha Net.`;
          } else {
            const responses = [
              'Monitorando canais de uplink ativamente.',
              'Os nós centrais da rede continuam operando sob resiliência ideal.',
              'Transmissão recebida. Compilando relatórios.',
              'Taxa de latência: 2ms. Canal seguro.'
            ];
            replyText = responses[Math.floor(Math.random() * responses.length)];
          }
        } else {
          const humanResponses = [
            `Saudações! Sou o operador(a) ${activeUserObj?.displayName || 'Nó Externo'}. Recebi o seu sinal: "${textToSend}"`,
            'Excelente análise de diretrizes. Deixe-me confirmar do meu lado.',
            'Podemos sincronizar isso depois? Estou terminando um ciclo de mineração de fichas.',
            'Nó atualizado com sucesso. Enviando mais instruções de dados em breve.',
            'Copiado. A rede Alpha Net está extremamente fluida hoje.',
            'Vou dar uma olhada e te respondo assim que possível.'
          ];
          replyText = humanResponses[Math.floor(Math.random() * humanResponses.length)];
        }

        const replyMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: replyText,
          isSender: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        if (!isOnline || isSimulated) {
          setMessagesDB(prev => ({
            ...prev,
            [currentChatId]: [...(prev[currentChatId] || []), replyMessage]
          }));
        } else {
          // If we are online and chatting with a real-time system bot, write the bot's reply message into Firestore
          try {
            const msgCol = collection(db, 'messages');
            const docId = `msg_${Date.now() + 1}`;
            setDoc(doc(msgCol, docId), {
              id: docId,
              senderId: currentChatId,
              receiverId: currentUser.id,
              content: replyText,
              createdAt: serverTimestamp()
            });
          } catch (e) {
            console.error('Failed to write BOT reply to Firestore:', e);
          }
        }
        setIsTyping(false);
      }, 1200 + Math.random() * 1500);
    }
  };

  const startConversation = (userId: string) => {
    if (!activeChatsList.includes(userId)) {
      setActiveChatsList(prev => [...prev, userId]);
    }
    setActiveChat(userId);
    setMobileShowChat(true);
  };

  // Filter list of active chat users based on search criteria
  const filteredActiveChats = activeChatsList
    .map(findUserById)
    .filter((u): u is User => !!u)
    .filter(u => {
      if (!contactsSearch) return true;
      return (
        u.displayName?.toLowerCase().includes(contactsSearch.toLowerCase()) ||
        u.username?.toLowerCase().includes(contactsSearch.toLowerCase())
      );
    });

  // Filter network users available to start a conversation with
  const availableNetworkUsers = onlineUsers.filter(u => u.id !== currentUser?.id);
  const filteredNetworkUsers = availableNetworkUsers.filter(u => {
    if (!searchQuery) return true;
    return (
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto w-full h-[calc(100vh-140px)] bg-white/5 rounded-3xl overflow-hidden flex border border-white/10 relative">
      <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
      
      {/* Sidebar Contacts */}
      <div className={`w-full md:w-80 border-r border-white/10 flex flex-col bg-black/20 z-10 relative ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              value={contactsSearch}
              onChange={e => setContactsSearch(e.target.value)}
              placeholder="Buscar frequência..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs font-mono text-white focus:outline-none focus:border-[#3BA8FF]/50"
            />
          </div>
          <button
            onClick={() => setIsUsersModalOpen(true)}
            id="open_network_users_sidebar_btn"
            className="p-2 bg-[#3BA8FF]/10 text-[#3BA8FF] hover:bg-[#3BA8FF]/20 border border-[#3BA8FF]/30 rounded-full shrink-0 transition-all cursor-pointer flex items-center justify-center font-mono text-xs"
            title="Adicionar Novo Contato da Rede"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-1">
          {filteredActiveChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-6 py-12 h-64">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3 animate-pulse">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-relaxed">Nenhum canal ativo</p>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-[165px] leading-normal font-sans mb-4">Inicie conversas criptografadas com operadores da rede</p>
              <button
                onClick={() => setIsUsersModalOpen(true)}
                className="bg-[#3BA8FF] hover:bg-[#3BA8FF]/90 text-black text-[10px] font-bold font-mono py-1.5 px-3 rounded-full shadow-[0_0_15px_rgba(59,168,255,0.35)] cursor-pointer tracking-wider uppercase"
              >
                Buscar Usuários
              </button>
            </div>
          ) : (
            filteredActiveChats.map((user) => {
              let lastMessage = 'Sinal de canal de comunicação ativo...';
              let lastTime = 'Ativo';

              if (isOnline && !isSimulated) {
                const userMsgs = (messages || []).filter(m => 
                  (m.senderId === currentUser.id && m.receiverId === user.id) ||
                  (m.senderId === user.id && m.receiverId === currentUser.id)
                );
                if (userMsgs.length > 0) {
                  const lastMsgObj = userMsgs[userMsgs.length - 1];
                  lastMessage = lastMsgObj.content;
                  lastTime = lastMsgObj.createdAt instanceof Date ? lastMsgObj.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ativo';
                }
              } else {
                const userMessages = messagesDB[user.id] || [];
                if (userMessages.length > 0) {
                  lastMessage = userMessages[userMessages.length - 1].text;
                  lastTime = userMessages[userMessages.length - 1].time;
                }
              }

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveChat(user.id);
                    setMobileShowChat(true);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeChat === user.id ? 'bg-white/10 border border-white/5 shadow-inner' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-zinc-800" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#A5E600] border-2 border-[#020202] rounded-full" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-sm truncate flex items-center gap-1">
                        {user.displayName}
                        {user.badges.includes('AI') && <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[8px] px-1 rounded uppercase tracking-widest font-mono">BOT</span>}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{lastTime}</span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate tracking-wide">
                      {lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeUser ? (
        <div className={`flex-1 flex flex-col relative overflow-hidden bg-[#020202] ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="h-16 border-b border-white/10 p-3 sm:p-4 flex items-center justify-between z-10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back button visible only on mobile */}
              <button 
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white mr-1"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 -ml-1 pr-3 rounded-xl transition-colors"
                onClick={() => setViewingUser(activeUser)}
              >
                <img src={activeUser.avatar} alt="Avatar" className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    {activeUser.displayName} 
                    {activeUser.badges.includes('AI') && <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">AI ENTITY</span>}
                  </h3>
                  <p className="text-[10px] text-[#A5E600] font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A5E600] block animate-pulse shadow-[0_0_8px_rgba(165,230,0,0.5)]" />
                    Protocolo Seguro Ativo
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Disparar uplink de voz"><Phone className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Abrir canal de hologramas"><Video className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Mais opções"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 space-y-4 flex flex-col relative z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-[#3BA8FF]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center font-mono text-[9px] sm:text-[10px] text-zinc-500 my-4 uppercase tracking-[0.2em] border-b border-white/5 pb-2">
              Canal Criptografado de Ponta a Ponta Estabelecido
            </div>

            {activeMessages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Início das Transmissões</p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-xs font-sans">Diga Olá para estabelecer a conexão quântica com este nó.</p>
              </div>
            )}

            {activeMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`flex gap-3 relative ${msg.isSender ? 'self-end flex-row-reverse' : ''}`}
              >
                {!msg.isSender && (
                  <img src={activeUser.avatar} className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-white/5" />
                )}
                <div>
                  <div className={`p-3 text-sm shadow-lg mb-1 leading-relaxed ${
                    msg.isSender 
                      ? 'bg-[#3BA8FF]/20 border border-[#3BA8FF]/30 text-white rounded-2xl rounded-tr-sm max-w-md' 
                      : 'bg-white/5 border border-white/10 text-zinc-200 rounded-2xl rounded-tl-sm max-w-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-zinc-500 font-mono flex ${msg.isSender ? 'justify-end mr-2' : 'ml-2'}`}>
                    {msg.time} {msg.isSender && '· Transmitido'}
                  </span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <img src={activeUser.avatar} className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-white/5" />
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm w-16 h-10 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-sm z-10 relative">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsUsersModalOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors shrink-0 cursor-pointer"
                title="Conectar com outro operador"
              >
                <Plus className="w-5 h-5 text-zinc-300" />
              </button>
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Transmitir mensagem na frequência segura..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-full py-2.5 px-5 text-sm focus:outline-none focus:border-[#3BA8FF]/50 focus:bg-white/10 transition-all font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="p-3 bg-[#3BA8FF] hover:bg-[#3BA8FF]/80 disabled:bg-zinc-600 disabled:shadow-none rounded-full transition-all shrink-0 text-black shadow-[0_0_15px_rgba(59,168,255,0.4)] cursor-pointer"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4 animate-bounce">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-widest">Nenhum Canal Selecionado</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1 max-w-sm">Abra a lista de conexões e selecione uma frequência ativa ou busque novos operadores da rede.</p>
          <button
            onClick={() => setIsUsersModalOpen(true)}
            className="mt-5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-full text-xs font-mono font-bold py-2 px-6 transition-all tracking-wide uppercase cursor-pointer animate-pulse"
          >
            Buscar todos os usuários da rede
          </button>
        </div>
      )}

      {/* MODAL: Todos os Usuários da Rede */}
      {isUsersModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative text-left overflow-hidden flex flex-col max-h-[85vh]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BA8FF]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <button 
              onClick={() => setIsUsersModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mb-6 shrink-0">
              <h3 className="text-lg font-display font-semibold text-white tracking-tight uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3BA8FF]" />
                Usuários da Rede Alpha Net
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">Abra um canal de comunicação direta com qualquer operador</p>
              
              {/* Search User Input */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar nó por nome ou @username..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-[#3BA8FF]/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll space-y-2 pr-1">
              {filteredNetworkUsers.length > 0 ? (
                filteredNetworkUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      startConversation(u.id);
                      setIsUsersModalOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <img src={u.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-zinc-800" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#A5E600] border-2 border-[#020202] rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-semibold text-sm truncate text-white block">
                          {u.displayName}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono italic shrink-0">
                          {u.username}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate tracking-wide">
                        {u.bio || 'Sem descrição quântica disponível.'}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Nenhum nó de rede localizado</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono shrink-0">
              <span>Total de conexões da rede: {filteredNetworkUsers.length}</span>
              <button 
                onClick={() => setIsUsersModalOpen(false)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Retornar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
