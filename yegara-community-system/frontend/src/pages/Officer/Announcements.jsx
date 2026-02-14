import React, { useEffect, useState } from 'react';
import { announcementsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    message: '',
    category: 'General',
    audienceRoles: ['resident']
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementsAPI.getAll();
      setAnnouncements(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await announcementsAPI.create({
        title: form.title,
        message: form.message,
        category: form.category,
        audienceRoles: form.audienceRoles
      });
      toast.success('Announcement published');
      setForm({ title: '', message: '', category: 'General', audienceRoles: ['resident'] });
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to publish announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementsAPI.delete(id);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Unable to delete announcement');
    }
  };

  const toggleAudience = (role) => {
    setForm((prev) => {
      if (prev.audienceRoles.includes(role)) {
        return { ...prev, audienceRoles: prev.audienceRoles.filter((item) => item !== role) };
      }
      return { ...prev, audienceRoles: [...prev.audienceRoles, role] };
    });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Announcements panel</h1>
        <p className="text-gray-600 mt-2">Publish updates to residents and staff.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows="4"
            className="input mt-1"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            className="input mt-1"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audience</label>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {['resident', 'officer', 'woreda_admin', 'subcity_admin', 'all'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleAudience(role)}
                className={`px-3 py-1 rounded-full border ${form.audienceRoles.includes(role) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Publish announcement</button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No announcements published yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-gray-600">{item.message}</p>
              <div className="mt-3 text-xs text-gray-500">
                Category: {item.category || 'General'} · Audience: {item.audienceRoles?.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
