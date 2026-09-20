import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkersPage } from './pages/WorkersPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { NewRequestPage } from './pages/NewRequestPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { AiProblemModal } from './components/AiProblemModal';
import { FixItAssistantDrawer } from './components/FixItAssistantDrawer';
import { api } from './services/api';
import { WorkerProfile, ServiceCategory } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewData, setViewData] = useState<any>(null);

  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals & Drawers
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [wRes, sRes] = await Promise.all([
        api.getWorkers(),
        api.getServices()
      ]);
      setWorkers(wRes.workers || []);
      setServices(sRes.categories || []);
    } catch (err) {
      console.error('Initial data fetch failed', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWorker = (worker: WorkerProfile) => {
    handleNavigate('new-request', {
      category: worker.serviceCategory,
      selectedWorkerId: worker.id
    });
  };

  const handleProceedFromAiModal = (data: any) => {
    setAiModalOpen(false);
    handleNavigate('new-request', data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F7] font-sans antialiased selection:bg-[#FF5C00] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setAiModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            workers={workers}
            services={services}
            onNavigate={handleNavigate}
            onOpenAiAssistant={() => setAiModalOpen(true)}
            onSelectWorker={handleSelectWorker}
          />
        )}

        {currentView === 'services' && (
          <ServicesPage
            services={services}
            onNavigate={handleNavigate}
            onSelectService={(serviceName) =>
              handleNavigate('workers', { category: serviceName })
            }
          />
        )}

        {currentView === 'workers' && (
          <WorkersPage
            workers={workers}
            services={services}
            initialFilters={viewData}
            onNavigate={handleNavigate}
            onSelectWorker={handleSelectWorker}
            onOpenAiAssistant={() => setAiModalOpen(true)}
          />
        )}

        {currentView === 'worker-profile' && viewData?.workerId && (
          <WorkerProfilePage
            workerId={viewData.workerId}
            onNavigate={handleNavigate}
            onSelectWorker={handleSelectWorker}
          />
        )}

        {currentView === 'new-request' && (
          <NewRequestPage
            workers={workers}
            services={services}
            prefillData={viewData}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard
            onNavigate={handleNavigate}
            onOpenAiAssistant={() => setAiModalOpen(true)}
            highlightRequestId={viewData?.highlightRequestId}
          />
        )}

        {currentView === 'worker-dashboard' && (
          <WorkerDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'admin-dashboard' && <AdminDashboard />}

        {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {currentView === 'register' && <RegisterPage onNavigate={handleNavigate} />}

        {currentView === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenAiAssistant={() => setAiModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setAiModalOpen(true)}
      />

      {/* Floating AI Helper Trigger button on all pages */}
      <button
        id="floating-ai-button"
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1C1C1E] hover:bg-[#242426] text-white p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition transform hover:scale-105 border border-white/10 hover:border-[#FF5C00]/40 group"
        title="Open FixIt Assistant"
      >
        <div className="w-6 h-6 rounded-lg bg-[#FF5C00] text-black flex items-center justify-center font-bold text-xs">
          ⚡
        </div>
        <span className="hidden sm:inline text-white/90 group-hover:text-white">FixIt Assistant</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]"></span>
        </span>
      </button>

      {/* AI Problem Diagnosis Modal (Vision + Problem Analysis + Smart Matching) */}
      {aiModalOpen && (
        <AiProblemModal
          onClose={() => setAiModalOpen(false)}
          onProceedToRequest={handleProceedFromAiModal}
        />
      )}

      {/* FixIt Assistant Conversational Drawer */}
      <FixItAssistantDrawer
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onPostProblem={(initialText) => {
          handleNavigate('new-request', { description: initialText });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
