import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

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
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Manage reports</h1>
        <p className="text-gray-600 mt-2">Update report status and notify residents.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No reports assigned to your department.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium text-gray-800">Status:</span> {report.status}</p>
                  <p><span className="font-medium text-gray-800">Resident:</span> {report.residentId?.fullName || 'Resident'}</p>
                </div>
              </div>

              <button
                className="mt-4 text-primary-600 text-sm"
                onClick={() => {
                  setUpdating(report._id);
                  setStatus(report.status);
                }}
              >
                Update status
              </button>

              {updating === report._id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <button className="btn btn-secondary" onClick={() => setUpdating(null)}>
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
