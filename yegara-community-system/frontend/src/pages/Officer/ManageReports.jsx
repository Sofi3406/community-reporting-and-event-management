import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Resolved: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200'
};

const ManageReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getByDepartment(user?.department);
      setReports(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load department reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (reportId) => {
    try {
      await reportsAPI.update(reportId, {
        status,
        updateMessage: message
      });
      toast.success('Report updated');
      setUpdating(null);
      setMessage('');
      setStatus('');
      fetchReports();
    } catch (error) {
      toast.error('Unable to update report');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.department]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-white via-primary-50 to-sky-50 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Manage reports</h1>
        <p className="text-gray-600 mt-2">Update report status and notify residents.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-gray-600">
          No reports assigned to your department.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description || 'No description provided.'}</p>
                </div>
                <div className="text-sm text-gray-600 md:text-right">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${statusStyles[report.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {report.status}
                  </span>
                  <p className="mt-2"><span className="font-medium text-gray-800">Resident:</span> {report.residentId?.fullName || 'Resident'}</p>
                </div>
              </div>

              <button
                className="mt-4 inline-flex items-center rounded-lg border border-primary-200 text-primary-700 text-sm font-medium px-3 py-1.5 hover:bg-primary-50"
                onClick={() => {
                  setUpdating(report._id);
                  setStatus(report.status);
                }}
              >
                Update status
              </button>

              {updating === report._id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/70 border border-gray-200 rounded-xl p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="input mt-1"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update message</label>
                    <input
                      className="input mt-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Optional update message"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button className="btn btn-primary" onClick={() => handleUpdate(report._id)}>
                      Save update
                    </button>
                    <button className="inline-flex items-center rounded-lg border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-100" onClick={() => setUpdating(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReports;
