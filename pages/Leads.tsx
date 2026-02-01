import React, { useMemo, useState } from 'react';
import { Lead } from '../types';
import LeadDetailModal from '../components/LeadDetailModal';

type LeadTab = 'Leads' | 'Revisit';

interface LeadsProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, result: string, notes: string) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onUpdateLead }) => {
  const [activeTab, setActiveTab] = useState<LeadTab>('Leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<{
    lead: Lead;
    focusCallResult: boolean;
  } | null>(null);

  const tabs: LeadTab[] = ['Leads', 'Revisit'];

  const filteredLeads = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return leads.filter((lead) => {
      // Hide terminal leads only (Not Interested, Wrong Number)
      if (lead.status === 'TERMINAL') return false;

      // DQ + LIVE appear in main Leads tab
      const displayStatus: LeadTab =
        lead.status === 'DQ' || lead.status === 'LIVE'
          ? 'Leads'
          : 'Revisit';

      if (displayStatus !== activeTab) return false;

      // Search by name or address
      if (!search) return true;

      return (
        lead.name.toLowerCase().includes(search) ||
        lead.address.toLowerCase().includes(search)
      );
    });
  }, [leads, activeTab, searchQuery]);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search leads by name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500"
        />
        <svg
          className="absolute left-4 top-3.5 w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lead List */}
      <div className="space-y-3">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() =>
                setSelectedLead({ lead, focusCallResult: false })
              }
              className="group bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-white text-lg mb-0.5">
                  {lead.name}
                </h4>
                <p className="text-slate-500 text-sm truncate">
                  {lead.address}
                </p>

                {lead.callLogged && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    CALL LOGGED
                  </div>
                )}
              </div>

              {/* Call / Open Detail */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLead({ lead, focusCallResult: true });
                }}
                className="w-12 h-12 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all flex-shrink-0"
                aria-label="Open call actions"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">
              {searchQuery
                ? 'No leads found'
                : 'No leads match this status'}
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead.lead}
          focusCallResult={selectedLead.focusCallResult}
          onClose={() => setSelectedLead(null)}
          onSave={(result, note) => {
            onUpdateLead(selectedLead.lead.id, result, note);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

export default Leads;
