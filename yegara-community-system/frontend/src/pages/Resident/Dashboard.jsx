import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Open reports', value: '3' },
    { label: 'In progress', value: '2' },
    { label: 'Resolved', value: '8' },
    { label: 'Upcoming events', value: '2' }
  ];

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
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
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
          <div className="mt-4 text-gray-500 text-sm">
            You have no recent reports to show. Create a new report to get started.
          </div>
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
