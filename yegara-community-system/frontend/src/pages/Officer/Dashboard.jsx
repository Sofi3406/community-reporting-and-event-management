import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800'
};

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchReports();
  }, [user?.department]);

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Pending').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-white via-primary-50 to-sky-50 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Officer dashboard</h1>
          <p className="text-gray-600 mt-2">Manage department reports and resident updates.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/officer/reports" className="btn btn-primary">Manage reports</Link>
          <Link to="/officer/announcements" className="btn btn-secondary">Announcements</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total reports', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'In progress', value: stats.inProgress },
          { label: 'Resolved', value: stats.resolved }
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-primary-600" style={{ width: stats.total ? `${(item.value / Math.max(stats.total, 1)) * 100}%` : '0%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent reports</h2>
            <Link to="/officer/reports" className="text-sm text-primary-600">View all</Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <p className="mt-4 text-gray-600">No reports assigned to your department.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.slice(0, 5).map((report) => (
                <li key={report._id} className="border border-gray-200 rounded-xl p-3 bg-gray-50/40">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{report.category} · {new Date(report.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link to="/officer/updates" className="block w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200">
              Post report updates
            </Link>
            <Link to="/officer/resources" className="block w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200">
              Upload resources
            </Link>
            <Link to="/officer/announcements" className="block w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200">
              Publish announcement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
