
import React from 'react';
import { Activity } from '../types';

interface DashboardProps {
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ activities }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Recent Activity (History)
      </h2>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{activity.repName}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-blue-400 font-medium">{activity.action}</span>
              </div>
              <p className="text-sm text-slate-300">Lead: <span className="text-white font-medium">{activity.leadName}</span></p>
            </div>
            <div className="text-[10px] text-slate-500 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
              {activity.timestamp}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No recent activity recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
