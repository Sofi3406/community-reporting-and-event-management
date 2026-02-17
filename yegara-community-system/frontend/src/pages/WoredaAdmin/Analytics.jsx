import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { reportsAPI } from '../../services/api';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800'
};

const Analytics = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getMyReports();
      setReports(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const stats = useMemo(() => {
    const pending = reports.filter((report) => report.status === 'Pending').length;
    const inProgress = reports.filter((report) => report.status === 'In Progress').length;
    const resolved = reports.filter((report) => report.status === 'Resolved').length;
    const rejected = reports.filter((report) => report.status === 'Rejected').length;

    return {
      total: reports.length,
      pending,
      inProgress,
      resolved,
      rejected
    };
  }, [reports]);

  const categoryBreakdown = useMemo(() => {
    return reports.reduce((acc, report) => {
      const key = report.category || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [reports]);

  const statusData = useMemo(() => (
    [
      { name: 'Pending', value: stats.pending },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Resolved', value: stats.resolved },
      { name: 'Rejected', value: stats.rejected }
    ]
  ), [stats]);

  const categoryData = useMemo(() => (
    Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }))
  ), [categoryBreakdown]);

  const trendData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    const days = eachDayOfInterval({ start, end });
    const counts = new Map();

    days.forEach((day) => {
      counts.set(format(day, 'MMM dd'), 0);
    });

    reports.forEach((report) => {
      const created = report.createdAt ? new Date(report.createdAt) : null;
      if (!created || created < start || created > end) return;
      const key = format(created, 'MMM dd');
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([date, value]) => ({ date, value }));
  }, [reports]);

  const resolutionStats = useMemo(() => {
    const resolvedReports = reports.filter((report) => report.status === 'Resolved');
    const totalResolvedDays = resolvedReports.reduce((sum, report) => {
      if (!report.resolvedAt || !report.createdAt) return sum;
      const resolvedAt = new Date(report.resolvedAt).getTime();
      const createdAt = new Date(report.createdAt).getTime();
      if (Number.isNaN(resolvedAt) || Number.isNaN(createdAt)) return sum;
      const diffDays = Math.max((resolvedAt - createdAt) / (1000 * 60 * 60 * 24), 0);
      return sum + diffDays;
    }, 0);

    const avgResolutionDays = resolvedReports.length
      ? totalResolvedDays / resolvedReports.length
      : 0;

    const resolutionRate = reports.length
      ? (resolvedReports.length / reports.length) * 100
      : 0;

    return {
      resolutionRate,
      avgResolutionDays
    };
  }, [reports]);

  const recentReports = useMemo(() => reports.slice(0, 8), [reports]);

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
        <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed report analytics for your woreda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total reports</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">In progress</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.resolved}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.rejected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Resolution rate</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {resolutionStats.resolutionRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg resolution days</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {resolutionStats.avgResolutionDays.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Reports by status</h2>
          {statusData.every((item) => item.value === 0) ? (
            <p className="mt-4 text-sm text-gray-500">No status data yet.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Reports by category</h2>
          {categoryData.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No category data yet.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Reports over time (last 30 days)</h2>
          {trendData.every((item) => item.value === 0) ? (
            <p className="mt-4 text-sm text-gray-500">No recent reports.</p>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={4} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recent reports</h2>
          {recentReports.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No reports submitted yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-gray-200">
              {recentReports.map((report) => (
                <div key={report._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
