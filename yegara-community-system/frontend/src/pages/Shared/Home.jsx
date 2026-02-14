import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-primary-600 font-semibold">
                Yegara Community System
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
                Report issues, join events, and stay connected with your community
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                A unified platform for residents, officers, and administrators to manage community
                reports, resources, and public events across woredas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
                <div>
                  <span className="text-gray-900 font-semibold">24/7</span> support
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">100%</span> transparent tracking
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Community dashboard snapshot</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Open reports</p>
                  <p className="text-2xl font-semibold text-gray-900">128</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Resolved this week</p>
                  <p className="text-2xl font-semibold text-gray-900">43</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Upcoming events</p>
                  <p className="text-2xl font-semibold text-gray-900">7</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Active resources</p>
                  <p className="text-2xl font-semibold text-gray-900">215</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/events"
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  View events →
                </Link>
                <Link
                  to="/resources"
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  Browse resources →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold text-gray-900">Everything your community needs</h2>
        <p className="mt-2 text-gray-600">Purpose-built tools for residents, officers, and administrators.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Report and track issues',
              description: 'Submit community reports with photos and track progress in real time.'
            },
            {
              title: 'Event coordination',
              description: 'Register for community events and access meeting links instantly.'
            },
            {
              title: 'Resource hub',
              description: 'Find official documents, notices, and guides tailored to your woreda.'
            }
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">How it works</h3>
            <ul className="mt-4 space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">1</span>
                Create your account and select your role.
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">2</span>
                Report issues, review events, or access resources.
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">3</span>
                Track updates and receive notifications in real time.
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Ready to join?</h3>
            <p className="mt-2 text-gray-600">Start with a quick registration and access your dashboard instantly.</p>
            <div className="mt-5">
              <Link
                to="/register"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
