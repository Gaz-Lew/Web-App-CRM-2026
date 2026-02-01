
import React, { useState, useEffect } from 'react';
import { getLeads, getDashboardActivity, updateLead, uploadLeads } from './api';
import { Lead, Activity, ViewType, QueuedLead } from './types';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import UploadLeads from './pages/UploadLeads';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [leadsData, activitiesData] = await Promise.all([
      getLeads(),
      getDashboardActivity()
    ]);
    setLeads(leadsData);
    setActivities(activitiesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateLead = async (leadId: string, result: string, notes: string) => {
    const success = await updateLead(leadId, result, notes);
    if (success) {
      alert('Result logged successfully!');
      fetchData();
    }
  };

  const handleBulkUpload = async (queuedLeads: QueuedLead[]) => {
    const success = await uploadLeads(queuedLeads);
    if (success) {
      alert(`${queuedLeads.length} leads uploaded as DQ status.`);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col items-center">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full bg-[#0a0f1d]/80 backdrop-blur-md z-40 border-b border-slate-800 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 overflow-hidden shadow-inner">
             <img src="https://picsum.photos/40/40" alt="Profile" className="opacity-80" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ASG Live Leads</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Syncing with Google Sheets...</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="mt-20 mb-24 w-full max-w-[800px] px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="font-medium">Loading CRM Data...</p>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && <Dashboard activities={activities} />}
            {currentView === 'leads' && <Leads leads={leads} onUpdateLead={handleUpdateLead} />}
            {currentView === 'upload' && <UploadLeads onBulkUpload={handleBulkUpload} />}
          </>
        )}
      </main>

      {/* App Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#0a0f1d]/90 backdrop-blur-lg border-t border-slate-800 px-6 py-2 flex justify-between max-w-[800px] rounded-t-3xl sm:mb-4 shadow-2xl">
        <NavItem 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
          label="Dashboard"
        />
        <NavItem 
          active={currentView === 'leads'} 
          onClick={() => setCurrentView('leads')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
          label="Leads"
        />
        <NavItem 
          active={currentView === 'upload'} 
          onClick={() => setCurrentView('upload')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>}
          label="Upload"
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 gap-1 rounded-2xl transition-all ${active ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"></div>}
    </button>
  );
};

export default App;
