import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Composer } from './components/feed/Composer';
import { FeedList } from './components/feed/FeedList';
import { ManagementDrawer } from './components/manage/ManagementDrawer';
import { EntityListView } from './components/manage/EntityListView';
import { LoginView } from './components/auth/LoginView';

function App() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [manageEntity, setManageEntity] = useState('Projects');
  // Temporarily bypass login by defaulting to Alice (Admin)
  const [currentUser, setCurrentUser] = useState({ id: 1, displayName: 'Alice', role: 'Admin' });

  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <AppLayout 
      currentUser={currentUser}
      onManageClick={() => setIsManageOpen(true)}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setIsManageOpen(false);
      }}
      onLogout={handleLogout}
    >
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800/50 p-4">
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{activeTab}</h1>
      </header>

      {/* Main Content */}
      {activeTab === 'Home' && (
        <>
          <Composer currentUser={currentUser} />
          <FeedList currentUser={currentUser} />
        </>
      )}

      {activeTab === 'Explore' && (
        <div className="p-12 text-center text-zinc-500 dark:text-zinc-500 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 text-2xl">
            🧭
          </div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">Explore SymboFlow</h3>
          <p>Discover trending projects and updates across the organization.</p>
          <div className="mt-8 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full text-sm font-medium">Coming Soon</div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="p-12 text-center text-zinc-500 dark:text-zinc-500 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 text-2xl">
            ⚙️
          </div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">Settings</h3>
          <p>Manage your account preferences and notifications.</p>
          <div className="mt-8 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full text-sm font-medium">Coming Soon</div>
        </div>
      )}

      {activeTab === 'Manage' && (
        <EntityListView entityType={manageEntity} currentUser={currentUser} />
      )}

      {/* Drawers */}
      <ManagementDrawer 
        isOpen={isManageOpen} 
        onClose={() => setIsManageOpen(false)} 
        currentUser={currentUser} 
        onSelectEntity={(entity) => {
          setManageEntity(entity);
          setActiveTab('Manage');
          setIsManageOpen(false);
        }}
      />
    </AppLayout>
  );
}

export default App;
