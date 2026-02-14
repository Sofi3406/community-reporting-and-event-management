import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    meetingLink: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getByWoreda(user?.woreda);
      setEvents(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', date: '', location: '', description: '', meetingLink: '' });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      if (editing) {
        await eventsAPI.update(editing, form);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create({ ...form, woreda: user?.woreda });
        toast.success('Event added successfully');
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error('Unable to save event');
    }
  };

  const handleEdit = (event) => {
    setEditing(event._id);
    setForm({
      title: event.title || '',
      date: event.date ? event.date.substring(0, 16) : '',
      location: event.location || '',
      description: event.description || '',
      meetingLink: event.meetingLink || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Unable to delete event');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?.woreda]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Manage events</h1>
        <p className="text-gray-600 mt-2">Create, update, and publish community events.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & time</label>
          <input
            type="datetime-local"
            className="input mt-1"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting link (optional)</label>
          <input
            className="input mt-1"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows="3"
            className="input mt-1"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update event' : 'Add event'}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No events created yet.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium text-gray-800">Date:</span> {new Date(event.date).toLocaleString()}</p>
                  <p><span className="font-medium text-gray-800">Location:</span> {event.location}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="btn btn-secondary" onClick={() => handleEdit(event)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(event._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
