import React, { useEffect, useState } from 'react';
import { announcementsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAnnouncements();
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
        <h1 className="text-3xl font-semibold text-gray-900">Public updates</h1>
        <p className="text-gray-600 mt-2">Latest announcements from your community administrators.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-gray-600">{item.message}</p>
              <div className="mt-3 text-xs text-gray-500">
                Category: {item.category || 'General'} · Posted by {item.createdBy?.fullName || 'Admin'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
