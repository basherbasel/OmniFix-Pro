import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { Sidebar } from './components/Sidebar';
import { SocialDashboard } from './components/SocialDashboard';
import { AIPostGenerator } from './components/AIPostGenerator';
import { SocialAnalytics } from './components/SocialAnalytics';
import { AccountsManager } from './components/AccountsManager';
import { ContentCalendar } from './components/ContentCalendar';
import { OmniFixCore } from './components/OmniFixCore';
import { ConsentGateway } from './components/ConsentGateway';
import { AutomationEngine } from './components/AutomationEngine';
import { RFNetworkStudio } from './components/RFNetworkStudio';
import { FirmwareIntegrityAnalyzer } from './components/FirmwareIntegrityAnalyzer';
import { ConsentProvider, useConsent } from './ConsentContext';
import { POPULAR_DEVICES } from './data/devicePresets';
import { DeviceInfo } from './types';
import { useAuth } from './AuthContext';
import { AdminDashboard, LoginScreen, RegisterScreen, ActivationScreen } from './components/AuthScreens';
import { AiExpertChat } from './components/AiExpertChat';

export function AppContent() {
  const { user, loading } = useAuth();
  const { isConsentOpen, activeRequirement, closeConsent, confirmConsent } = useConsent();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeDevice] = useState<DeviceInfo>(POPULAR_DEVICES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-400 font-bold font-mono">جاري تحميل نظام OmniFix Pro...</div>;
  }

  if (!user) {
    return authScreen === 'login' ? <LoginScreen onSwitch={() => setAuthScreen('register')} /> : <RegisterScreen onSwitch={() => setAuthScreen('login')} />;
  }

  if (!user.isActive && user.role !== 'admin') {
    return <ActivationScreen />;
  }

  if (currentTab === 'admin-dashboard' && user.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Consent Gateway Global Modal */}
      <ConsentGateway 
        isOpen={isConsentOpen}
        requirement={activeRequirement}
        onClose={closeConsent}
        onConfirm={confirmConsent}
      />

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Layout Wrapper */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Modern Sidebar Navigation */}
        {currentTab !== 'admin-dashboard' && (
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            activeDevice={activeDevice} 
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {/* Phase 1: OmniFix Pro Core */}
                {currentTab === 'dashboard' && (
                  <WelcomeDashboard onSelectTab={setCurrentTab} />
                )}

                {currentTab === 'omnifix-core' && (
                  <OmniFixCore />
                )}

                {currentTab === 'automation-engine' && (
                  <AutomationEngine />
                )}

                {currentTab === 'rf-studio' && (
                  <RFNetworkStudio />
                )}

                {currentTab === 'firmware-analyzer' && (
                  <FirmwareIntegrityAnalyzer />
                )}

                {/* Legacy / Shared Hubs */}
                {currentTab === 'content-studio' && (
                  <AIPostGenerator />
                )}

                {currentTab === 'calendar' && (
                  <ContentCalendar />
                )}

                {currentTab === 'analytics' && (
                  <SocialAnalytics />
                )}

                {currentTab === 'accounts' && (
                  <AccountsManager />
                )}
                
                {currentTab === 'ai-expert' && (
                  <AiExpertChat device={activeDevice} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-bold text-slate-300">OmniFix Pro &copy; 2026</div>
            <div className="text-[10px]">The Autonomous Hive-Mind Architecture for Mobile Engineering</div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 text-indigo-400">Gemini 3.7 Pro Engaged</span>
            <span>•</span>
            <span>Content Automation</span>
            <span>•</span>
            <span>Predictive Analytics</span>
            <span>•</span>
            <span>Multi-Channel Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ConsentProvider>
      <AppContent />
    </ConsentProvider>
  );
}
