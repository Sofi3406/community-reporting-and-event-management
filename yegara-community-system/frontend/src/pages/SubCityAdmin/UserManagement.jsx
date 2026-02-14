import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    woreda: ''
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll({ role: 'woreda_admin' });
      setAdmins(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load woreda admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.woreda) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      await usersAPI.create({
        fullName: form.fullName,
        email: form.email,
        role: 'woreda_admin',
        woreda: form.woreda
      });
      toast.success('Woreda Admin added successfully');
      setForm({ fullName: '', email: '', woreda: '' });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to add admin');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this woreda admin?')) return;
    try {
      await usersAPI.delete(id);
      toast.success('Woreda Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      toast.error('Unable to delete admin');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Manage woreda admins</h1>
        <p className="text-gray-600 mt-2">Create or remove woreda admin accounts.</p>
      </div>

      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full name</label>
          <input
            className="input mt-1"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="input mt-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Woreda</label>
          <input
            className="input mt-1"
            value={form.woreda}
            onChange={(e) => setForm({ ...form, woreda: e.target.value })}
          />
        </div>
        <div className="md:col-span-3">
          <button type="submit" className="btn btn-primary">Add Woreda Admin</button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No woreda admins found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Woreda</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{admin.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{admin.woreda}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
