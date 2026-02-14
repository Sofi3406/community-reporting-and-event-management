import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const PostUpdates = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('');
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getByDepartment(user?.department);
      setReports(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport || !message) {
      toast.error('Please select a report and enter a message');
      return;
    }

    try {
      await reportsAPI.postUpdate(selectedReport, { message });
      toast.success('Update posted');
      setMessage('');
    } catch (error) {
      toast.error('Unable to post update');
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
        <h1 className="text-3xl font-semibold text-gray-900">Post report updates</h1>
        <p className="text-gray-600 mt-2">Share clarifications for residents and keep them informed.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select report</label>
          <select
            className="input mt-1"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="">Choose a report</option>
            {reports.map((report) => (
              <option key={report._id} value={report._id}>
                {report.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Update message</label>
          <textarea
            rows="4"
            className="input mt-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide an update for residents"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Post update
        </button>
      </form>
    </div>
  );
};

export default PostUpdates;
