import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ManageOfficers = () => {
  const { user } = useAuth();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    department: '',
    customDepartment: ''
  });

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll({ role: 'officer' });
      setOfficers(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load officers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.department) {
      toast.error('Please complete all required fields');
      return;
    }

    if (form.department === 'Other' && !form.customDepartment.trim()) {
      toast.error('Please enter the custom category for this officer');
      return;
    }

    try {
      await usersAPI.create({
        fullName: form.fullName,
        email: form.email,
        role: 'officer',
        department: form.department,
        customDepartment: form.department === 'Other' ? form.customDepartment.trim() : undefined,
        woreda: user?.woreda
      });
      toast.success('Department Officer added successfully');
      setForm({ fullName: '', email: '', department: '', customDepartment: '' });
      fetchOfficers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to add officer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this officer?')) return;
    try {
      await usersAPI.delete(id);
      toast.success('Department Officer deleted successfully');
      fetchOfficers();
    } catch (error) {
      toast.error('Unable to delete officer');
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, [user?.woreda]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Manage department officers</h1>
        <p className="text-gray-600 mt-2">Add or remove officers in your woreda.</p>
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
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            className="input mt-1"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value, customDepartment: '' })}
          >
            <option value="">Select department</option>
            <option value="Water">Water</option>
            <option value="Road">Road</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {form.department === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Custom category</label>
            <input
              className="input mt-1"
              placeholder="Use the resident's category"
              value={form.customDepartment}
              onChange={(e) => setForm({ ...form, customDepartment: e.target.value })}
            />
          </div>
        )}
        <div className="md:col-span-3">
          <button type="submit" className="btn btn-primary">Add officer</button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : officers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No officers found for this woreda.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custom category</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {officers.map((officer) => (
                <tr key={officer._id}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{officer.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{officer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{officer.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{officer.customDepartment || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(officer._id)}
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

export default ManageOfficers;
