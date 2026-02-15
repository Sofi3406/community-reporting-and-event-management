import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <Navbar />

      <header className="relative overflow-hidden">
        <div className="absolute -top-16 -right-20 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl float-slow" />
        <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl float-slow float-delay" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rise-in">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">
                Yegara Community System
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-display font-semibold text-slate-900 leading-tight">
                Make every neighborhood report feel heard, tracked, and resolved.
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                A shared space for residents and leaders to coordinate local issues, community events,
                and official resources across every woreda.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 shadow-sm"
                >
                  Start as a resident
                </Link>
                <Link
                  to="/login"
                  className="bg-white/80 backdrop-blur border border-amber-200 text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-white"
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="bg-white/70 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-slate-900 font-semibold">2,400+</p>
                  <p>reports tracked with transparency</p>
                </div>
                <div className="bg-white/70 border border-emerald-100 rounded-xl px-4 py-3">
                  <p className="text-slate-900 font-semibold">24/7</p>
                  <p>community response visibility</p>
                </div>
              </div>
            </div>

            <div className="rise-in rise-in-delay">
              <div className="rounded-3xl border border-amber-100 bg-white/90 backdrop-blur p-8 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold">Live snapshot</p>
                    <h2 className="text-2xl font-display text-slate-900">Neighborhood pulse</h2>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Updated now</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Open reports', value: '128' },
                    { label: 'Resolved this week', value: '43' },
                    { label: 'Upcoming events', value: '7' },
                    { label: 'Active resources', value: '215' }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-sm">
                      <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 text-sm font-semibold">
                  <Link to="/events" className="text-emerald-700 hover:text-emerald-600">
                    View events →
                  </Link>
                  <Link to="/resources" className="text-amber-700 hover:text-amber-600">
                    Browse resources →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-display text-slate-900">Everything your community needs</h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Purpose-built tools for residents and leaders to coordinate reports, resources, and public events.
            </p>
          </div>
          <div className="text-sm text-slate-500 bg-white/70 border border-slate-200 rounded-xl px-4 py-3">
            Officers and admins are onboarded by woreda leadership.
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Report & track issues',
              description: 'Submit community reports with photos and watch progress updates as they happen.'
            },
            {
              title: 'Coordinate local events',
              description: 'Stay informed about upcoming meetings, public services, and community gatherings.'
            },
            {
              title: 'Access verified resources',
              description: 'Find official notices, emergency updates, and useful documents by woreda.'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.description}</p>
              <div className="mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <h3 className="text-2xl font-display text-slate-900">How it works</h3>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">1</span>
                Create a resident account to submit and track local issues.
              </li>
              <li className="flex gap-3">
                <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">2</span>
                Woreda admins onboard officers and manage response workflows.
              </li>
              <li className="flex gap-3">
                <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">3</span>
                Get updates, event invites, and resources in real time.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8 shadow-sm">
            <h3 className="text-2xl font-display text-slate-900">Ready to join?</h3>
            <p className="mt-3 text-slate-600">
              Registration is open for residents. Officers and admins are created by woreda leadership.
            </p>
            <div className="mt-6">
              <Link
                to="/register"
                className="inline-flex items-center bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800"
              >
                Create a resident account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
