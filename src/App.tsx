import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeToggle } from './components/ThemeToggle';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { MealPrepTab } from './components/tabs/MealPrepTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { AchievementModal } from './components/AchievementModal';
import { useAchievementNotification } from './hooks/useAchievementNotification';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from './providers/AuthProvider';
import { Header } from './components/Header';
import { AuthForm } from './components/auth/AuthForm';
import { useAuth } from './providers/AuthProvider';
import { InstallDrawer } from './components/pwa/InstallDrawer';
import { usePWAUpdater } from './hooks/usePWAUpdater';
import { LandingPage } from './components/landing/LandingPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { newAchievement, clearAchievement } = useAchievementNotification();
  const { user, loading } = useAuth();
  
  usePWAUpdater();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      
      <div className="w-full px-4 mx-auto sm:max-w-3xl">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'mealprep' && <MealPrepTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      {newAchievement && (
        <AchievementModal 
          achievement={newAchievement} 
          onClose={clearAchievement}
        />
      )}

      <InstallDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/install" element={<LandingPage />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
