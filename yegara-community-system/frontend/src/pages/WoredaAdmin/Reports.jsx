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

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getMyReports();
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
        <p className="text-gray-600 mt-2">Review every report submitted in your woreda.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No reports found for your woreda.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Submitted: {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium text-gray-800">Category:</span> {report.category}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Resident:</span>{' '}
                    {report.residentId?.fullName || 'Resident'}
                  </div>
                  <div>
                    <span className={`inline-flex text-xs px-2 py-1 rounded-full ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}>
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
