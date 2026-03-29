import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { publicAPI } from '../../services/api';

const Home = () => {
  const [snapshot, setSnapshot] = useState({
    openReports: 0,
    resolvedThisWeek: 0,
    upcomingEvents: 0,
    activeResources: 0,
    updatedAt: null
  });
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSnapshot = async () => {
      setLoadingSnapshot(true);
      try {
        const response = await publicAPI.getLandingStats();
        if (!isMounted) return;

        const data = response.data?.data || {};
        setSnapshot({
          openReports: Number(data.openReports || 0),
          resolvedThisWeek: Number(data.resolvedThisWeek || 0),
          upcomingEvents: Number(data.upcomingEvents || 0),
          activeResources: Number(data.activeResources || 0),
          updatedAt: data.updatedAt || null
        });
      } catch (error) {
        if (isMounted) {
          setSnapshot((prev) => ({ ...prev, updatedAt: null }));
        }
      } finally {
        if (isMounted) {
          setLoadingSnapshot(false);
        }
      }
    };

    fetchSnapshot();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Open reports', value: snapshot.openReports },
      { label: 'Resolved this week', value: snapshot.resolvedThisWeek },
      { label: 'Upcoming events', value: snapshot.upcomingEvents },
      { label: 'Active resources', value: snapshot.activeResources }
    ],
    [snapshot]
  );

  const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8ef] via-[#fffdf7] to-[#f3faf9]">
      <Navbar />

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(251,191,36,0.18),transparent_42%),radial-gradient(circle_at_82%_10%,rgba(45,212,191,0.14),transparent_38%),radial-gradient(circle_at_82%_76%,rgba(14,165,233,0.12),transparent_42%)]" />
        <div className="absolute -top-16 -right-20 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl float-slow" />
        <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl float-slow float-delay" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rise-in">
              <p className="inline-block text-xs uppercase tracking-[0.28em] text-amber-800 font-semibold px-3 py-1 rounded-full border border-amber-300/80 bg-white/70">
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
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:brightness-105 shadow-md shadow-amber-200/70"
                >
                  Start as a resident
                </Link>
                <Link
                  to="/login"
                  className="bg-white/85 backdrop-blur border border-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-white shadow-sm"
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="bg-white/80 border border-amber-100 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-slate-900 font-semibold">Resident-first workflow</p>
                  <p>Submit once, follow updates, and get notified when action is taken.</p>
                </div>
                <div className="bg-white/80 border border-emerald-100 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-slate-900 font-semibold">Shared governance</p>
                  <p>Residents, officers, and admins collaborate in one transparent system.</p>
                </div>
              </div>
            </div>

            <div className="rise-in rise-in-delay">
              <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur p-8 shadow-xl shadow-emerald-100/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold">Live snapshot</p>
                    <h2 className="text-2xl font-display text-slate-900">Neighborhood pulse</h2>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    {loadingSnapshot
                      ? 'Syncing...'
                      : snapshot.updatedAt
                        ? `Updated ${new Date(snapshot.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Updated recently'}
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-5 shadow-sm">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {loadingSnapshot ? '...' : formatNumber(stat.value)}
                      </p>
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
          <div className="text-sm text-slate-500 bg-white/70 border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
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
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
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
