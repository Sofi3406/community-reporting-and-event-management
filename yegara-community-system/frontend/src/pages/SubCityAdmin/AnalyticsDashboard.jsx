import React, { useState, useEffect } from 'react';
import {
  BarChart, LineChart, PieChart,
  Bar, Line, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { analyticsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [selectedWoreda, setSelectedWoreda] = useState('all');
  const [loading, setLoading] = useState(true);
  const [realtimeData, setRealtimeData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchRealtimeData();
    
    // Refresh real-time data every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    
    return () => clearInterval(interval);
  }, [timeFilter, selectedWoreda]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getDashboard({
        period: timeFilter,
        woreda: selectedWoreda
      });
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await analyticsAPI.getRealtime();
      setRealtimeData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch real-time data');
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor system performance and community engagement</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
          
          <select
            value={selectedWoreda}
            onChange={(e) => setSelectedWoreda(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Woredas</option>
            <option value="woreda1">Woreda 1</option>
            <option value="woreda2">Woreda 2</option>
            <option value="woreda3">Woreda 3</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={analytics?.summary?.totalReports || 0}
          icon={DocumentTextIcon}
          trend="+12%"
          color="text-blue-600"
        />
        <StatCard
          title="Resolution Rate"
          value={`${analytics?.summary?.resolutionRate || 0}%`}
          icon={ChartBarIcon}
          trend="+5%"
          color="text-green-600"
        />
        <StatCard
          title="Active Users"
          value={analytics?.summary?.activeUsers || 0}
          icon={UsersIcon}
          trend="+8%"
          color="text-purple-600"
        />
        <StatCard
          title="Avg. Resolution"
          value={`${analytics?.summary?.averageResolutionDays || 0} days`}
          icon={ClockIcon}
          trend="-2 days"
          color="text-orange-600"
        />
      </div>

      {/* Real-time Stats */}
      {realtimeData && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-80">Reports Last Hour</p>
              <p className="text-2xl font-bold">{realtimeData.reportsLastHour}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Reports Today</p>
              <p className="text-2xl font-bold">{realtimeData.reportsToday}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Active Users Today</p>
              <p className="text-2xl font-bold">{realtimeData.activeUsersToday}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Pending Reports</p>
              <p className="text-2xl font-bold">{realtimeData.pendingReports}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.reportsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="reports" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="resolved" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Woreda Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Woreda Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.woredaPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="woreda" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalReports" name="Total Reports" fill="#0088FE" />
              <Bar dataKey="resolutionRate" name="Resolution Rate %" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.departmentPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, percent }) => `${department}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalReports"
              >
                {analytics?.departmentPerformance?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Woreda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.recentReports?.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.woreda}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'Resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : report.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;