import { FC } from 'react';
import { Search, ChevronDown, Menu, Wifi, WifiOff, Coins, LogIn, LogOut, ShieldAlert, X } from 'lucide-react';
import { useOnline } from '../context/OnlineContext';

interface TopbarProps {
  onToggleMobile: () => void;
}

export const Topbar: FC<TopbarProps> = ({ onToggleMobile }) => {
  const { 
    isOnline, 
    setIsOnline, 
    user, 
    currentUser, 
    tokenBalance, 
    loginWithGoogle, 
    loginWithGoogleRedirect,
    logout,
    authError,
    setAuthError,
    isSimulated,
    loginAsSimulated,
    isConnectModalOpen,
    setIsConnectModalOpen
  } = useOnline();

  return (
    <div className="h-20 fixed top-0 right-0 lg:left-64 left-0 bg-black/30 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-8 z-40">
      {authError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-left">
            <button 
              onClick={() => setAuthError(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD83D]/10 text-[#FFD83D] flex items-center justify-center border border-[#FFD83D]/20 animate-pulse shadow-[0_0_20px_rgba(255,216,61,0.15)]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-base font-display font-semibold text-white tracking-tight uppercase">Protocolo Google Bloqueado</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5 tracking-wider">Aviso de Sandbox Iframe</p>
              </div>
              
              <p className="text-xs text-zinc-400 leading-relaxed font-sans px-2">
                {authError}
              </p>
              
              <div className="flex flex-col w-full gap-2 pt-2">
                <button
                  onClick={() => {
                    loginAsSimulated();
                  }}
                  className="w-full bg-[#A5E600] text-black font-semibold rounded-xl text-xs py-3 hover:bg-[#A5E600]/90 transition-all font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(165,230,0,0.2)]"
                >
                  CONECTAR COM ID SIMULADA
                </button>
                
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      window.open(window.location.href, '_blank');
                    }}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2 hover:bg-white/10 transition-all font-mono hover:border-white/20 text-center"
                  >
                    Nova Aba ↗
                  </button>
                  <button
                    onClick={() => {
                      setAuthError(null);
                      loginWithGoogleRedirect();
                    }}
                    className="flex-1 bg-[#3BA8FF] hover:bg-[#3BA8FF]/90 text-white rounded-xl text-xs py-2 transition-all font-mono font-bold"
                  >
                    Usar Redirect
                  </button>
                </div>

                <button
                  onClick={() => setAuthError(null)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-white rounded-xl text-xs py-2 transition-all font-mono mt-1"
                >
                  Fechar Aviso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-1 lg:flex-initial mr-2">
        {/* Mobile menu trigger */}
        <button 
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0 mr-1 sm:mr-2"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-full max-w-[140px] sm:max-w-xs md:w-80 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-[#3BA8FF] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar rede..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#3BA8FF]/50 focus:bg-white/10 transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Token Balance display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A5E600]/10 border border-[#A5E600]/20 text-[#A5E600] font-mono text-xs sm:text-sm">
          <Coins className="w-4 h-4" />
          <span>{tokenBalance.toLocaleString()}</span>
        </div>

        {/* Connection status controller */}
        <button
          onClick={() => {
            if (!isOnline && !user) {
              setIsConnectModalOpen(true);
            } else {
              setIsOnline(!isOnline);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase border transition-all ${
            isOnline 
              ? 'bg-[#A5E600]/10 border-[#A5E600]/30 text-[#A5E600] shadow-[0_0_10px_rgba(165,230,0,0.1)] hover:bg-[#A5E600]/20'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'
          }`}
          title={isOnline ? "Desconectar do Modo Online (Voltar para Bots)" : "Conectar com Modo Online (Transmissões Reais)"}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIMULAÇÃO</span>
            </>
          )}
        </button>

        {/* Profile Card & Google Authentication Trigger */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2 py-1 rounded-full">
              <img src={currentUser.avatar} alt="Avatar" className="w-6 h-6 sm:w-7 h-7 rounded-full bg-zinc-800 border border-white/10" />
              <span className="text-xs font-mono text-zinc-200 hidden md:block max-w-[100px] truncate">{currentUser.username}</span>
              <button 
                onClick={logout} 
                className="p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-[#FF4A4A] transition-colors"
                title="Sair da Conta Google"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="flex items-center gap-2 bg-[#3BA8FF]/10 hover:bg-[#3BA8FF]/20 border border-[#3BA8FF]/30 text-[#3BA8FF] px-3 py-1.5 rounded-full text-xs font-semibold font-mono transition-colors"
              title="Entrar com conta Google"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login Google</span>
            </button>
          )}
        </div>
      </div>

      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative text-left overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BA8FF]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A5E600]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <button 
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-xl mb-3 text-[#A5E600]">
                <Wifi className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white tracking-tight uppercase">Conectar ao Terminal Alpha Net</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">Selecione o protocolo de conexão operacional</p>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Option A: Simulated/Synthetic login (Recommended in Sandbox) */}
              <button
                onClick={() => {
                  loginAsSimulated();
                  setIsConnectModalOpen(false);
                }}
                className="w-full text-left bg-gradient-to-r from-[#A5E600]/10 to-transparent hover:from-[#A5E600]/15 border border-[#A5E600]/30 hover:border-[#A5E600]/50 p-4 rounded-xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(165,230,0,0.02)]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#A5E600]/10 text-[#A5E600] flex items-center justify-center border border-[#A5E600]/20 shrink-0 mt-0.5 font-mono text-xs font-bold">
                    [A]
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase font-mono">Conexão Simulada Inteligente</span>
                      <span className="bg-[#A5E600]/20 text-[#A5E600] text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Altamente Recomendada</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                      Ativa todos os recursos online instantaneamente no visor do AI Studio. Utiliza roteamento de simulação avançado livre de impedimentos ou bloqueios de popup do navegador.
                    </p>
                    <div className="mt-2 text-[10px] text-[#A5E600] font-mono flex items-center gap-1">
                      <span>● Status: Pronto para conexão imediata</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Option B: Real Google Sign-In (Popup) */}
              <button
                onClick={async () => {
                  // Direct call in user interaction handler to maximize popup success
                  await loginWithGoogle();
                  setIsConnectModalOpen(false);
                }}
                className="w-full text-left bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3BA8FF]/10 text-[#3BA8FF] flex items-center justify-center border border-[#3BA8FF]/20 shrink-0 mt-0.5 font-mono text-xs font-bold">
                    [B]
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white uppercase font-mono font-sans">Login Real Google (Popup)</span>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Conecta diretamente ao Firestore usando um popup de autorização Google.
                    </p>
                    <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                      Nota: Algumas sandboxes/iframes de editores de código bloqueiam popups.
                    </div>
                  </div>
                </div>
              </button>

              {/* Option C: Real Google Sign-In (Redirect) */}
              <button
                onClick={() => {
                  setIsConnectModalOpen(false);
                  loginWithGoogleRedirect();
                }}
                className="w-full text-left bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/10 text-[#A78BFA] flex items-center justify-center border border-[#A78BFA]/20 shrink-0 mt-0.5 font-mono text-xs font-bold">
                    [C]
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white uppercase font-mono font-sans">Login Real Google (Sem Popup / Redirect)</span>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Redireciona diretamente o visor para a página da Google para fazer login. Recomendado se os popups falharem.
                    </p>
                    <div className="mt-2 text-[10px] text-[#A78BFA] font-mono">
                      Infallible fallback: Bypassa totalmente bloqueadores de popup.
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Sinal de uplink: Alto desempenho</span>
              <button 
                onClick={() => setIsConnectModalOpen(false)}
                className="hover:text-white transition-colors"
              >
                Retornar em modo offline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

