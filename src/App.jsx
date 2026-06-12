import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Composer } from './components/feed/Composer';
import { FeedList } from './components/feed/FeedList';
import { ManagementDrawer } from './components/manage/ManagementDrawer';
import { EntityListView } from './components/manage/EntityListView';
import { LoginView } from './components/auth/LoginView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { NotificationToast } from './components/notifications/NotificationToast';
import { io } from 'socket.io-client';

const socket = io('');

function App() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [manageEntity, setManageEntity] = useState('Projects');
  const [currentUser, setCurrentUser] = useState({ id: 1, displayName: 'Alice', role: 'Admin' });
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  React.useEffect(() => {
    if (!currentUser) return;
    
    fetch('/api/notifications', {
      headers: { 'x-user-id': currentUser.id }
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setNotifications(data))
      .catch(console.error);

    const handleNewNotif = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setActiveToast(notif);
      setTimeout(() => setActiveToast(null), 5000);
    };

    socket.on(`notification_${currentUser.id}`, handleNewNotif);
    return () => socket.off(`notification_${currentUser.id}`, handleNewNotif);
  }, [currentUser]);

  const handleMarkAsRead = (id) => {
    fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      .then(() => setNotifications(prev => prev.map(n => n.Id === id ? { ...n, IsRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    fetch('/api/notifications/read-all', { 
      method: 'PATCH',
      headers: { 'x-user-id': currentUser.id }
    })
      .then(() => setNotifications(prev => prev.map(n => ({ ...n, IsRead: true }))));
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <AppLayout 
      currentUser={currentUser}
      unreadNotifications={notifications.filter(n => !n.IsRead).length}
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

      {activeTab === 'Notifications' && (
        <NotificationsView 
          currentUser={currentUser}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onNavigate={(path) => {
             // For now we just switch tab based on link. In a real router, we'd navigate
             if (path.includes('task')) { setActiveTab('Manage'); setManageEntity('Tasks'); }
             else if (path.includes('ticket')) { setActiveTab('Manage'); setManageEntity('Tickets'); }
             else { setActiveTab('Home'); }
          }}
        />
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

      <NotificationToast 
        toast={activeToast} 
        onClose={() => setActiveToast(null)} 
        onNavigate={(path) => {
           if (path.includes('task')) { setActiveTab('Manage'); setManageEntity('Tasks'); }
           else if (path.includes('ticket')) { setActiveTab('Manage'); setManageEntity('Tickets'); }
           else { setActiveTab('Home'); }
        }} 
      />
    </AppLayout>
  );
}

export default App;
