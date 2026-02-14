import React from 'react';
import { analyticsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const ExportData = () => {
  const handleExport = async (type) => {
    try {
      const response = await analyticsAPI.exportData({ type });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Unable to export data');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Export data</h1>
        <p className="text-gray-600 mt-2">Download system data for analysis and reporting.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        {[
          { type: 'reports', label: 'Export reports' },
          { type: 'events', label: 'Export events' },
          { type: 'users', label: 'Export users' }
        ].map((item) => (
          <div key={item.type} className="flex items-center justify-between">
            <p className="text-gray-900 font-medium">{item.label}</p>
            <button
              className="btn btn-secondary"
              onClick={() => handleExport(item.type)}
            >
              Download CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportData;
