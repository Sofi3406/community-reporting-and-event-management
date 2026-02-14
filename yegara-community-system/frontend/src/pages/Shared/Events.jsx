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
                className={`w-full text-left border rounded-xl p-5 shadow-sm ${selected?._id === event._id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected(event)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-600">{event.description?.slice(0, 120)}...</p>
                <p className="mt-2 text-sm text-gray-500">{event.location}</p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Event details</h2>
            {selected ? (
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p><span className="font-medium text-gray-900">Title:</span> {selected.title}</p>
                <p><span className="font-medium text-gray-900">Date:</span> {new Date(selected.date).toLocaleString()}</p>
                <p><span className="font-medium text-gray-900">Location:</span> {selected.location}</p>
                {selected.meetingLink && (
                  <p>
                    <span className="font-medium text-gray-900">Meeting link:</span>{' '}
                    <a href={selected.meetingLink} className="text-primary-600" target="_blank" rel="noreferrer">
                      Join
                    </a>
                  </p>
                )}
                <p className="text-gray-600">{selected.description}</p>
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
