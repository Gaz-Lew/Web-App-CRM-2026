import React, { useMemo, useState } from 'react';
import { Lead } from '../types';
import LeadDetailModal from '../components/LeadDetailModal';

/* ---------------- HELPERS ---------------- */

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-AU'); // dd/mm/yyyy
};

const formatPhoneAU = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return phone;
  return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'DQ':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'LIVE':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'REVISIT':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-slate-700 text-slate-400';
  }
};

type LeadTab = 'Leads' | 'Revisit';

interface LeadsProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, result: string, notes: string) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onUpdateLead }) => {
  const [activeTab, setActiveTab] = useState<LeadTab>('Leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [repFilter, setRepFilter] = useState('');
  const [suburbFilter, setSuburbFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedLead, setSelectedLead] = useState<{
    lead: Lead;
    focusCallResult: boolean;
  } | null>(null);

  const filteredLeads = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return leads.filter((lead) => {
      // Hide terminal outcomes only
      if (lead.status === 'TERMINAL') return false;

      // Tab mapping
      const displayTab: LeadTab =
        lead.status === 'DQ' || lead.status === 'LIVE'
          ? 'Leads'
          : 'Revisit';

      if (displayTab !== activeTab) return false;

      // Search
      if (
        search &&
        !lead.name.toLowerCase().includes(search) &&
        !lead.address.toLowerCase().includes(search)
      ) {
        return false;
      }

      // Rep filter
      if (repFilter && lead.generatedBy !== repFilter) return false;

      // Suburb filter
      if (suburbFilter && !lead.address.toLowerCase().includes(suburbFilter.toLowerCase())) {
        return false;
      }

      // Date range
      if (fromDate && new Date(lead.lastContactDate) < new Date(fromDate)) return false;
      if (toDate && new Date(lead.lastContactDate) > new Date(toDate)) return false;

      return true;
    });
  }, [leads, activeTab, searchQuery, repFilter, suburbFilter, fromDate, toDate]);

  /* -------- GROUP BY DATE -------- */

  const groupedLeads = useMemo(() => {
    const groups: Record<string, Lead[]> = {};

    filteredLeads.forEach((lead) => {
      const key = lead.lastContactDate
        ? formatDate(lead.lastContactDate)
        : 'No Date';

      if (!groups[key]) groups[key] = [];
      groups[key].push(lead);
    });

    return Object.entries(groups);
  }, [filteredLeads]);

  return (
    <div className="flex flex-col">

      {/* SEARCH + FILTERS */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            placeholder="Filter by suburb"
            value={suburbFilter}
            onChange={(e) => setSuburbFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          />
          <input
            placeholder="Filter by rep"
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {(['Leads', 'Revisit'] as LeadTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GROUPED LEADS */}
      {groupedLeads.map(([date, leads]) => (
        <div key={date}>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 mt-6">
            {date}
          </h3>

          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead({ lead, focusCallResult: false })}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{lead.name}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadgeClass(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm">{lead.address}</p>
                  <p className="text-slate-400 text-xs">
                    {formatPhoneAU(lead.phone)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead({ lead, focusCallResult: true });
                  }}
                  className="text-blue-400"
                >
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* MODAL */}
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
