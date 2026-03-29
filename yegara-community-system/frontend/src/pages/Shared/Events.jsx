import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventsAPI.register(eventId);
      toast.success('Registered for event');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to register');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatOrganizer = (organizer) => {
    if (!organizer) return 'Admin';

    const roleLabel = organizer.role === 'subcity_admin'
      ? 'Sub city Admin'
      : organizer.role === 'woreda_admin'
        ? 'Woreda Admin'
        : organizer.role === 'officer'
          ? 'Officer'
          : 'Admin';

    return organizer.fullName ? `${roleLabel} / ${organizer.fullName}` : roleLabel;
  };

  const formatEventTime = (value) => {
    const date = new Date(value);
    return {
      day: date.toLocaleDateString(undefined, { day: '2-digit' }),
      month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
      full: date.toLocaleString()
    };
  };

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
        <h1 className="text-3xl font-semibold text-gray-900">Community events</h1>
        <p className="text-gray-600 mt-2">View upcoming meetings and community activities.</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No upcoming events available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {events.map((event) => (
              <button
                key={event._id}
                className={`w-full text-left border rounded-2xl p-5 shadow-sm transition-all ${selected?._id === event._id ? 'border-primary-400 bg-primary-50 shadow-md' : 'border-gray-200 bg-white hover:shadow-md'}`}
                onClick={() => setSelected(event)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white w-14 h-14 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[10px] tracking-wide">{formatEventTime(event.date).month}</span>
                      <span className="text-base font-semibold leading-none">{formatEventTime(event.date).day}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formatEventTime(event.date).full}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-medium border border-primary-100 shrink-0">
                    {event.woreda || 'All Woredas'}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">{event.description?.slice(0, 140) || 'No description available.'}</p>
                <p className="mt-3 text-sm text-gray-700 font-medium">{event.location}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Created by: {formatOrganizer(event.organizer)}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Event details</h2>
            {selected ? (
              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-xl font-semibold text-gray-900">{selected.title}</p>
                  <p className="text-gray-600 mt-1">{formatEventTime(selected.date).full}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-medium border border-primary-100">
                    Scope: {selected.woreda || 'All Woredas'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 px-3 py-1 text-xs font-medium border border-gray-200">
                    Organizer: {formatOrganizer(selected.organizer)}
                  </span>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Location</p>
                  <p className="text-sm text-gray-800 mt-1">{selected.location}</p>
                </div>

                {selected.meetingLink && (
                  <a
                    href={selected.meetingLink}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-medium px-4 py-2 hover:bg-primary-700 transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join online meeting
                  </a>
                )}

                <p className="text-gray-600 leading-relaxed">{selected.description || 'No description available.'}</p>

                <button
                  onClick={() => handleRegister(selected._id)}
                  className="btn btn-primary w-full"
                >
                  Register
                </button>
              </div>
            ) : (
              <p className="mt-4 text-gray-600">Select an event to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
