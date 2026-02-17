import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI, reportsAPI } from '../../services/api';
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const eventParams = {
          status: 'Upcoming',
          'date[gte]': new Date().toISOString()
        };

        if (user.woreda) {
          eventParams.woreda = user.woreda;
        }

        const [reportsResponse, eventsResponse] = await Promise.all([
          reportsAPI.getMyReports(),
          eventsAPI.getAll(eventParams)
        ]);

        if (!isMounted) return;

        setReports(reportsResponse.data?.data || []);
        setEvents(eventsResponse.data?.data || []);
      } catch (error) {
        if (isMounted) {
          toast.error('Unable to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const stats = useMemo(() => {
    const pendingCount = reports.filter((report) => report.status === 'Pending').length;
    const inProgressCount = reports.filter((report) => report.status === 'In Progress').length;
    const resolvedCount = reports.filter((report) => report.status === 'Resolved').length;

    return [
      { label: 'Open reports', value: pendingCount },
      { label: 'In progress', value: inProgressCount },
      { label: 'Resolved', value: resolvedCount },
      { label: 'Upcoming events', value: events.length }
    ];
  }, [reports, events]);

  const recentReports = useMemo(() => reports.slice(0, 3), [reports]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Welcome back{user?.fullName ? `, ${user.fullName}` : ''}</h1>
          <p className="text-gray-600 mt-2">Track your reports and stay updated with your community.</p>
        </div>
        <Link
          to="/resident/reports/new"
          className="bg-primary-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-primary-700 text-center"
        >
          Report an issue
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {loading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent reports</h2>
            <Link to="/resident/reports" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="mt-4 text-gray-500 text-sm">
              You have no recent reports to show. Create a new report to get started.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-200">
              {recentReports.map((report) => (
                <div key={report._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <Link
                      to={`/resident/reports/${report._id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {report.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full w-fit ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link
              to="/events"
              className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              Browse events
            </Link>
            <Link
              to="/resources"
              className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              Download resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
