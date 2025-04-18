import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProjectsProvider } from './hooks/useProjects';
import { TimeEntriesProvider } from './hooks/useTimeEntries';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectManagement } from './components/ProjectManagement';
import { TimeTracking } from './components/TimeTracking/TimeTracking';
import { HistoryView } from './components/TimeTracking/HistoryView';
import { Reports } from './components/Reports';
import { Auth } from './components/Auth/Auth';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { isAuthenticated, loading } = useAuth();

  // Define tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'time-tracking', label: 'Chấm Công', icon: 'timer' },
    { id: 'projects', label: 'Dự Án', icon: 'projects' },
    { id: 'history', label: 'Lịch Sử', icon: 'history' },
    { id: 'reports', label: 'Báo Cáo', icon: 'reports' }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !['login', 'register'].includes(currentTab)) {
      setCurrentTab('login');
    }
  }, [isAuthenticated, loading, currentTab]);

  // Render current tab content
  const renderContent = () => {
    // If not authenticated, show auth screens
    if (!isAuthenticated) {
      return <Auth initialTab={currentTab === 'register' ? 'register' : 'login'} />;
    }

    // Otherwise, show the appropriate tab content
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'time-tracking':
        return <TimeTracking />;
      case 'projects':
        return <ProjectManagement />;
      case 'history':
        return <HistoryView />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header setCurrentTab={setCurrentTab} />

        {isAuthenticated && (
            <Navigation
                tabs={tabs}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />
        )}

        <main className="flex-grow">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {renderContent()}
          </div>
        </main>

        <Footer />
      </div>
  );
}

function App() {
  return (
      <AuthProvider>
        <ProjectsProvider>
          <TimeEntriesProvider>
            <AppContent />
          </TimeEntriesProvider>
        </ProjectsProvider>
      </AuthProvider>
  );
}

export default App;