import React, { useState } from 'react';
import { ProjectsProvider } from './hooks/useProjects';
import { TimeEntriesProvider } from './hooks/useTimeEntries';
import { SettingsProvider } from './hooks/useSettings';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectManagement } from './components/ProjectManagement';
import { TimeTracking } from './components/TimeTracking/TimeTracking';
import { HistoryView } from './components/TimeTracking/HistoryView';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { DataImportExport } from './components/DataManagement/DataImportExport';
import './styles/tailwind.css';

function AppContent() {
    const [currentTab, setCurrentTab] = useState('dashboard');

    // Define tabs
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'time-tracking', label: 'Chấm Công', icon: 'timer' },
        { id: 'projects', label: 'Dự Án', icon: 'projects' },
        { id: 'history', label: 'Lịch Sử', icon: 'history' },
        { id: 'reports', label: 'Báo Cáo', icon: 'reports' },
        { id: 'settings', label: 'Cài Đặt', icon: 'settings' },
        { id: 'data', label: 'Dữ Liệu', icon: 'data' }
    ];

    // Render current tab content
    const renderContent = () => {
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
            case 'settings':
                return <Settings />;
            case 'data':
                return <DataImportExport />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header setCurrentTab={setCurrentTab} />

            <Navigation
                tabs={tabs}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />

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
        <SettingsProvider>
            <ProjectsProvider>
                <TimeEntriesProvider>
                    <AppContent />
                </TimeEntriesProvider>
            </ProjectsProvider>
        </SettingsProvider>
    );
}

export default App;