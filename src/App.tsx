import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AuthView } from './views/Auth';
import { HomeFeed } from './views/HomeFeed';
import { ModuleHub } from './views/ModuleHub';
import { ProfileView } from './views/Profile';
import { CommunitiesView } from './views/Communities';
import { NotificationsView } from './views/Notifications';
import { MessagesView } from './views/Messages';
import { SettingsView } from './views/Settings';
import { DataMiningView } from './views/DataMining';
import { MissionsView } from './views/Missions';
import { AvatarEditorView } from './views/AvatarEditor';
import { QuantumArenaView } from './views/QuantumArena';
import { AffinitiesDossierView } from './views/AffinitiesDossier';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('feed');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Boot sequence simulation
  useEffect(() => {
    // Check if session exists (simulated local storage)
    const session = localStorage.getItem('alpha_net_session');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('alpha_net_session', 'active');
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <HomeFeed />;
      case 'modules':
        return <ModuleHub onNavigate={setCurrentView} />;
      case 'mining':
        return <DataMiningView />;
      case 'missions':
        return <MissionsView />;
      case 'avatar':
        return <AvatarEditorView />;
      case 'arena':
        return <QuantumArenaView />;
      case 'affinities':
        return <AffinitiesDossierView />;
      case 'profile':
        return <ProfileView />;
      case 'communities':
        return <CommunitiesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] flex overflow-hidden font-sans">
      {/* Global Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
         <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>
      
      {/* Global Glows */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#3BA8FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#B84CFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-[#A5E600]/5 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      
      <div className="flex-1 lg:ml-64 ml-0 flex flex-col relative z-10 w-full overflow-hidden">
        <Topbar onToggleMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-28 pb-12 w-full custom-scroll">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
