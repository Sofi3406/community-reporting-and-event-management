import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { meetingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VirtualMeetings = () => {
  const { user } = useAuth();
  const canManageMeetings = user?.role === 'woreda_admin' || user?.role === 'subcity_admin';
  const isSubcityAdmin = user?.role === 'subcity_admin';
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    woreda: '',
    participants: '',
    roles: [],
    description: '',
    link: ''
  });

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      woreda: '',
      participants: '',
      roles: [],
      description: '',
      link: ''
    });
    setEditingMeetingId(null);
  };

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
    const hasEmailParticipants = Boolean(form.participants.trim());
    const hasRoleParticipants = form.roles.length > 0;

    if (!form.title || !form.date || !form.link || (!hasEmailParticipants && !hasRoleParticipants)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const participantEmails = form.participants
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      const payload = {
        title: form.title,
        scheduledAt: form.date,
        woreda: isSubcityAdmin ? (form.woreda || 'All Woredas') : undefined,
        participantEmails,
        participantRoles: form.roles,
        description: form.description,
        meetingLink: form.link
      };

      if (editingMeetingId) {
        await meetingsAPI.update(editingMeetingId, payload);
        toast.success('Virtual meeting updated successfully');
      } else {
        await meetingsAPI.create(payload);
        toast.success('Virtual meeting scheduled successfully');
      }

      resetForm();
      fetchMeetings();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to schedule meeting');
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeetingId(meeting._id);
    setForm({
      title: meeting.title || '',
      date: meeting.scheduledAt ? new Date(meeting.scheduledAt).toISOString().slice(0, 16) : '',
      woreda: meeting.woreda || '',
      participants: meeting.participants
        ?.map((participant) => participant.email)
        .filter(Boolean)
        .join(', ') || '',
      roles: Array.from(new Set(
        (meeting.participants || [])
          .map((participant) => participant.role)
          .filter((role) => role === 'resident' || role === 'officer' || role === 'woreda_admin')
      )),
      description: meeting.description || '',
      link: meeting.meetingLink || ''
    });
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Delete this meeting?')) return;

    try {
      await meetingsAPI.delete(meetingId);
      toast.success('Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to delete meeting');
    }
  };

  const handleRoleToggle = (role) => {
    setForm((prev) => {
      if (role === 'all') {
        return {
          ...prev,
          roles: prev.roles.includes('all') ? [] : ['all']
        };
      }

      const baseRoles = prev.roles.filter((item) => item !== 'all');

      if (prev.roles.includes(role)) {
        return { ...prev, roles: baseRoles.filter((item) => item !== role) };
      }

      return { ...prev, roles: [...baseRoles, role] };
    });
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getParticipantLabel = (participant) => participant.email || participant.role || 'Participant';

  const formatMeetingTime = (value) => {
    const date = new Date(value);
    return {
      day: date.toLocaleDateString(undefined, { day: '2-digit' }),
      month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
      full: date.toLocaleString()
    };
  };

  const isMeetingOwner = (meeting) => {
    const creatorId = typeof meeting.createdBy === 'object' ? meeting.createdBy?._id : meeting.createdBy;
    return String(creatorId || '') === String(user?._id || '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Virtual meetings</h1>
        <p className="text-gray-600 mt-2">
          {canManageMeetings
            ? 'Schedule online discussions, notify participants, and manage existing meetings.'
            : 'Meetings you are invited to will appear here.'}
        </p>
      </div>

      {canManageMeetings && (
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
        {isSubcityAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Meeting scope</label>
            <input
              className="input mt-1"
              placeholder="All Woredas or specific woreda"
              value={form.woreda}
              onChange={(e) => setForm({ ...form, woreda: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to create a system-wide meeting.</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Participants</label>
          <input
            className="input mt-1"
              placeholder="Comma-separated emails (optional if role buttons are selected)"
            value={form.participants}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {[
                { value: 'resident', label: 'Resident' },
                { value: 'officer', label: 'Officer' },
                { value: 'woreda_admin', label: 'Woreda Admin' },
                { value: 'all', label: 'All' }
              ].map((role) => (
              <button
                  key={role.value}
                type="button"
                  onClick={() => handleRoleToggle(role.value)}
                  className={`px-3 py-1 rounded-full border ${form.roles.includes(role.value) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                  {role.label}
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
            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary">
                {editingMeetingId ? 'Update meeting' : 'Schedule meeting'}
              </button>
              {editingMeetingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
        </div>
      </form>
      )}

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
            <div key={meeting._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white w-16 h-16 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[11px] tracking-wide">{formatMeetingTime(meeting.scheduledAt).month}</span>
                    <span className="text-lg font-semibold leading-none">{formatMeetingTime(meeting.scheduledAt).day}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{meeting.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatMeetingTime(meeting.scheduledAt).full}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-medium border border-primary-100">
                        Scope: {meeting.woreda || 'All Woredas'}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={meeting.meetingLink}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-medium px-4 py-2 hover:bg-primary-700 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Join meeting
                </a>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">Participants</p>
                <div className="flex flex-wrap gap-2">
                  {(meeting.participants || []).length > 0 ? (
                    meeting.participants.map((participant, index) => (
                      <span
                        key={`${meeting._id}-participant-${index}`}
                        className="inline-flex items-center rounded-md bg-gray-50 text-gray-700 px-2.5 py-1 text-xs border border-gray-200"
                      >
                        {getParticipantLabel(participant)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No participants assigned.</span>
                  )}
                </div>
              </div>

              {meeting.description && (
                <div className="mt-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {meeting.description}
                </div>
              )}

              {canManageMeetings && isMeetingOwner(meeting) && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleEditMeeting(meeting)}
                    className="inline-flex items-center rounded-lg border border-primary-200 text-primary-700 text-sm font-medium px-3 py-1.5 hover:bg-primary-50"
                  >
                    Edit meeting
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(meeting._id)}
                    className="inline-flex items-center rounded-lg border border-red-200 text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50"
                  >
                    Delete meeting
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualMeetings;
