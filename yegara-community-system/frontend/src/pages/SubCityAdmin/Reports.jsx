import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { reportsAPI } from '../../services/api';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800'
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatReportTime = (value) => {
    const date = new Date(value);
    return {
      day: date.toLocaleDateString(undefined, { day: '2-digit' }),
      month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
      full: date.toLocaleString()
    };
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getAll({ sort: '-createdAt', limit: 100 });
      setReports(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">All reports</h1>
        <p className="text-gray-600 mt-2">Review reports submitted across all woredas.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No reports found.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white w-14 h-14 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] tracking-wide">{formatReportTime(report.createdAt).month}</span>
                    <span className="text-base font-semibold leading-none">{formatReportTime(report.createdAt).day}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description || 'No description provided.'}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Submitted: {formatReportTime(report.createdAt).full}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 lg:text-right">
                  <div className="flex flex-wrap lg:justify-end gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 px-3 py-1 text-xs font-medium border border-gray-200">
                      Category: {report.category || 'General'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-medium border border-primary-100">
                      Woreda: {report.woreda || 'N/A'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium border border-indigo-100">
                      Resident: {report.residentId?.fullName || 'Resident'}
                    </span>
                    <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
