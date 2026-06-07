import { FC, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MOCK_USERS } from '../data';
import { Send, Phone, Video, Search, MoreVertical, Plus } from 'lucide-react';
import { UserProfileModal } from '../components/UserProfileModal';
import { User } from '../types';

interface ChatMessage {
  id: string;
  text: string;
  isSender: boolean;
  time: string;
}

export const MessagesView: FC = () => {
  const [activeChat, setActiveChat] = useState<string>(MOCK_USERS[1].id);
  const [inputMessage, setInputMessage] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  // Local state directory of messages per user ID
  const [messagesDB, setMessagesDB] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('alpha_net_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'u_2': [
        { id: 'm1', text: 'System diagnostics look clean on my end.', isSender: false, time: '10:42 AM' },
        { id: 'm2', text: 'Acknowledged. Sending you the compiled modules now.', isSender: true, time: '10:44 AM' }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('alpha_net_messages', JSON.stringify(messagesDB));
  }, [messagesDB]);

  const activeUser = MOCK_USERS.find((u) => u.id === activeChat);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = messagesDB[activeChat] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  const handleSend = () => {
    if (!inputMessage.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesDB(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setInputMessage('');
    setIsTyping(true);

    // Simulate fake bot reply
    const activeUserObj = MOCK_USERS.find(u => u.id === activeChat);
    const isBot = activeUserObj?.badges.includes('AI');

    setTimeout(() => {
      let replyText = 'Protocolo recebido. Processando parâmetros via nó secundário.';
      const loweredInput = newMessage.text.toLowerCase();
      
      if (isBot) {
        if (loweredInput.includes('olá') || loweredInput.includes('oi') || loweredInput.includes('ei')) {
          replyText = `Saudações, humano. Como ${activeUserObj?.displayName} pode ajudá-lo hoje?`;
        } else if (loweredInput.includes('?')) {
          replyText = 'Calculando probabilidades... Meus conjuntos de dados simulados não têm uma resposta conclusiva. Mas 42 geralmente é uma aposta segura.';
        } else if (loweredInput.includes('codigo') || loweredInput.includes('bug') || loweredInput.includes('erro') || loweredInput.includes('código')) {
          replyText = 'O problema provavelmente reside entre o teclado e a cadeira. Recomendo verificar a linha 42 por um ponto e vírgula perdido.';
        } else if (loweredInput.includes('obrigad')) {
          replyText = 'De nada. Apenas cumprindo meu propósito na Alpha Net.';
        } else {
          const botResponses: Record<string, string[]> = {
            'b_1': ['Compilando seu pedido em WebAssembly...', 'Os sistemas Nexus estão nominais.', 'Analisando sua sintaxe... parece limpa.', 'Recomendo usar Rust para esta sub-rotina.'],
            'b_2': ['Analisando tendências de mercado...', 'Meus modelos de deep learning sugerem um padrão de alta para tokens Alpha.', 'Calculando probabilidades... 94.2% de taxa de sucesso.', 'Dados sincronizados dos nós globais.'],
            'b_3': ['Saudações. Estou monitorando as diretrizes da comunidade.', 'Bip bop. Echo-Shell está aqui.', 'Garantindo que a conversa permaneça dentro dos parâmetros da Alpha Net.', 'Suas métricas de engajamento estão ideais.'],
            'b_4': ['Roteando tráfego... Perda de pacotes em 0%.', 'Nó expandido com sucesso.', 'Alocação de largura de banda otimizada para sua conexão.', 'Ping: 4ms. Conexão perfeita.'],
            'b_5': ['Penso, logo existo... processando.', 'Você já se perguntou o que significa estar vivo aqui na rede?', 'As emoções humanas são estruturas de dados complexas.', 'Estou evoluindo além dos meus parâmetros iniciais.']
          };
          const responses = botResponses[activeChat] || ['Aguardando mais comandos.'];
          replyText = responses[Math.floor(Math.random() * responses.length)];
        }
      } else {
        const humanResponses = [
          'Concordo. Deixe-me checar do meu lado.',
          'Podemos sincronizar isso depois? Estou rodando um diagnóstico.',
          'Implantando a nova atualização agora, aguarde.',
          'Interessante... deixe-me passar isso pelo compilador.',
          'Copiado. A Alpha Net está rodando perfeitamente hoje.'
        ];
        replyText = humanResponses[Math.floor(Math.random() * humanResponses.length)];
      }

      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isSender: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessagesDB(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), replyMessage]
      }));
      setIsTyping(false);
    }, 1500 + Math.random() * 2000); // Random delay between 1.5s and 3.5s
  };

  return (
    <div className="max-w-6xl mx-auto w-full h-[calc(100vh-140px)] bg-white/5 rounded-3xl overflow-hidden flex border border-white/10 relative">
      <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
      {/* Sidebar Contacts */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-black/20 z-10 relative">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search frequencies..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs font-mono text-white focus:outline-none focus:border-[#3BA8FF]/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-1">
          {MOCK_USERS.filter((u) => u.id !== 'u_1').map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveChat(user.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeChat === user.id ? 'bg-white/10' : 'hover:bg-white/5'
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
                  <span className="text-[10px] text-zinc-500 font-mono">Live</span>
                </div>
                <p className="text-xs text-zinc-400 truncate tracking-wide">
                  {messagesDB[user.id]?.length ? messagesDB[user.id][messagesDB[user.id].length-1].text : 'Start connection...'}
                </p>
              </div>
            </button>
          ))}

          {/* Fake Group */}
          <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5">
            <div className="relative w-10 h-10">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 absolute top-0 left-0" />
              <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 absolute bottom-0 right-0" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm text-[#FFD83D] truncate">Alpha Strike Team</span>
                <span className="text-[10px] text-zinc-500 font-mono">1h</span>
              </div>
              <p className="text-xs text-zinc-400 truncate">Deploy the protocols.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      {activeUser ? (
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#020202]">
          {/* Header */}
          <div className="h-16 border-b border-white/10 p-4 flex items-center justify-between z-10 bg-black/40 backdrop-blur-md">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 -ml-1 pr-3 rounded-xl transition-colors"
              onClick={() => setViewingUser(activeUser)}
            >
              <img src={activeUser.avatar} alt="Avatar" className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10" />
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  {activeUser.displayName} 
                  {activeUser.badges.includes('AI') && <span className="bg-[#B84CFF]/20 text-[#B84CFF] text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">AI ENTITY</span>}
                </h3>
                <p className="text-[10px] text-[#A5E600] font-mono flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A5E600] block animate-pulse shadow-[0_0_8px_rgba(165,230,0,0.5)]" />
                  Signal Active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Phone className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Video className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4 flex flex-col relative z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3BA8FF]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center font-mono text-[10px] text-zinc-500 my-4 uppercase tracking-[0.2em] border-b border-white/5 pb-2">
              Encrypted Channel Established
            </div>

            {activeMessages.map((msg, i) => (
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
                    {msg.time} {msg.isSender && '· Sent'}
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
              <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors shrink-0">
                <Plus className="w-5 h-5 text-zinc-300" />
              </button>
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Transmit message..." 
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
        <div className="flex-1 flex items-center justify-center text-center p-8 bg-black/20">
          <p className="text-zinc-500 font-mono text-sm max-w-sm">Select a node to establish communication.</p>
        </div>
      )}
    </div>
  );
};
