import React, { useState } from 'react';
import { QueuedLead } from '../types';

interface UploadLeadsProps {
  onBulkUpload: (leads: QueuedLead[]) => Promise<boolean> | boolean;
}

const REP_OPTIONS = ['Sam Rep', 'Alex Agent', 'Jess Sales'] as const;
const EMPLOYMENT_OPTIONS = ['Full-Time', 'Part-Time'] as const;

const UploadLeads: React.FC<UploadLeadsProps> = ({ onBulkUpload }) => {
  const today = new Date().toISOString().split('T')[0];

  const emptyForm: QueuedLead = {
    date: today,
    name: '',
    houseNumber: '',
    streetName: '',
    suburb: '',
    postcode: '',
    phone: '04',
    renterOwner: '',
    superannuation: '',
    employmentType: '',
    repName: ''
  };

  const [queue, setQueue] = useState<QueuedLead[]>([]);
  const [formData, setFormData] = useState<QueuedLead>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) return false;
    if (!formData.suburb.trim()) return false;
    if (!formData.repName) return false;
    if (!formData.renterOwner) return false;
    if (!formData.superannuation) return false;
    if (!formData.employmentType) return false;
    if (!formData.phone || formData.phone.length < 8) return false;
    if (!formData.houseNumber || !formData.streetName) return false;
    return true;
  };

  const handleSaveToQueue = () => {
    if (!validateForm()) {
      setError('Please complete all required fields before saving.');
      return;
    }

    setError(null);
    setQueue((prev) => [...prev, formData]);

    // Reset form but keep rep name
    setFormData({
      ...emptyForm,
      repName: formData.repName
    });
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    const success = await onBulkUpload(queue);

    if (success !== false) {
      setQueue([]);
    }

    setUploading(false);
  };

  return (
    <div className="pb-20 animate-in slide-in-from-right duration-500">

      {/* Queue */}
      {queue.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
            Queued Leads ({queue.length})
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 border border-slate-800 rounded-xl p-2 bg-slate-900/30">
            {queue.map((lead, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700"
              >
                <div>
                  <p className="font-bold text-sm">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.suburb}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromQueue(idx)}
                  className="text-red-400 p-1 hover:bg-red-500/10 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            disabled={uploading}
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            {uploading ? 'Uploading…' : 'Upload to Google Sheets'}
          </button>
        </div>
      )}

      {/* Form */}
      <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">
        Lead Information Form
      </h3>

      <div className="space-y-4">

        {/* Date */}
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        {/* Name */}
        <input
          type="text"
          placeholder="Lead Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        {/* Address */}
        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="House #"
            value={formData.houseNumber}
            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          />
          <input
            placeholder="Street Name"
            value={formData.streetName}
            onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
            className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Suburb"
            value={formData.suburb}
            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          />
          <input
            placeholder="Postcode"
            value={formData.postcode}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          />
        </div>

        {/* Phone */}
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        {/* Dropdowns */}
        <select
          value={formData.renterOwner}
          onChange={(e) => setFormData({ ...formData, renterOwner: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        >
          <option value="">Renter / Owner</option>
          <option value="Owner">Owner</option>
          <option value="Renter">Renter</option>
        </select>

        <select
          value={formData.superannuation}
          onChange={(e) => setFormData({ ...formData, superannuation: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        >
          <option value="">Superannuation</option>
          <option value="$0–75k">$0–75k</option>
          <option value="$75–150k">$75–150k</option>
          <option value="$150k+">$150k+</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={formData.employmentType}
          onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        >
          <option value="">Employment Type</option>
          {EMPLOYMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={formData.repName}
          onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        >
          <option value="">Rep Name</option>
          {REP_OPTIONS.map((rep) => (
            <option key={rep} value={rep}>{rep}</option>
          ))}
        </select>

        {error && (
          <p className="text-sm text-red-400 font-medium">{error}</p>
        )}

        <button
          onClick={handleSaveToQueue}
          className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold py-5 rounded-2xl"
        >
          Save to Queue
        </button>
      </div>
    </div>
  );
};

export default UploadLeads;