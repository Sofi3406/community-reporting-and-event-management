import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { meetingsAPI } from '../../services/api';

const VirtualMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    date: '',
    participants: '',
    roles: [],
    description: '',
    link: ''
  });

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await meetingsAPI.getAll();
      setMeetings(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.participants || !form.link) {
      toast.error('Please fill in all required fields');
      return;
    }

    const participantEmails = form.participants
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      await meetingsAPI.create({
        title: form.title,
        scheduledAt: form.date,
        participantEmails,
        participantRoles: form.roles,
        description: form.description,
        meetingLink: form.link
      });
      toast.success('Virtual meeting scheduled successfully');
      setForm({ title: '', date: '', participants: '', roles: [], description: '', link: '' });
      fetchMeetings();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to schedule meeting');
    }
  };

  const handleRoleToggle = (role) => {
    setForm((prev) => {
      if (prev.roles.includes(role)) {
        return { ...prev, roles: prev.roles.filter((item) => item !== role) };
      }
      return { ...prev, roles: [...prev.roles, role] };
    });
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Virtual meetings</h1>
        <p className="text-gray-600 mt-2">Schedule online discussions and notify participants.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting title</label>
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
          <label className="block text-sm font-medium text-gray-700">Participants</label>
          <input
            className="input mt-1"
            placeholder="Emails or roles"
            value={form.participants}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {['resident', 'officer'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleToggle(role)}
                className={`px-3 py-1 rounded-full border ${form.roles.includes(role) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting link</label>
          <input
            className="input mt-1"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
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
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">Schedule meeting</button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No meetings scheduled yet.
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{new Date(meeting.scheduledAt).toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">
                Participants: {meeting.participants?.map((p) => p.email || p.role).join(', ')}
              </p>
              <a href={meeting.meetingLink} className="text-primary-600 text-sm" target="_blank" rel="noreferrer">
                Join meeting
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualMeetings;
