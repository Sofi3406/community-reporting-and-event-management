import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'resident',
    woreda: '',
    department: '',
    customDepartment: '',
    accessCode: '',
    isActive: false
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = roleFilter !== 'all' ? { role: roleFilter } : undefined;
      const response = await usersAPI.getAll(params);
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await usersAPI.delete(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to delete user');
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'resident',
      woreda: user.woreda || '',
      department: user.department || '',
      customDepartment: user.customDepartment || '',
      accessCode: user.accessCode || '',
      isActive: Boolean(user.isActive)
    });
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    setEditForm({
      fullName: '',
      email: '',
      phone: '',
      role: 'resident',
      woreda: '',
      department: '',
      customDepartment: '',
      accessCode: '',
      isActive: false
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editForm.fullName || !editForm.email || !editForm.role) {
      toast.error('Please complete required fields');
      return;
    }

    if ((editForm.role === 'resident' || editForm.role === 'woreda_admin') && !editForm.woreda) {
      toast.error('Woreda is required for this role');
      return;
    }

    if (editForm.role === 'officer' && !editForm.department) {
      toast.error('Department is required for officers');
      return;
    }

    if (editForm.role === 'officer' && editForm.department === 'Other' && !editForm.customDepartment) {
      toast.error('Custom department is required when department is Other');
      return;
    }

    if (editForm.role === 'officer' && !editForm.accessCode) {
      toast.error('Access code is required for officers');
      return;
    }

    const payload = {
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      isActive: editForm.isActive
    };

    if (editForm.role === 'resident' || editForm.role === 'woreda_admin') {
      payload.woreda = editForm.woreda;
    }

    if (editForm.role === 'officer') {
      payload.department = editForm.department;
      payload.accessCode = editForm.accessCode;
      if (editForm.department === 'Other') {
        payload.customDepartment = editForm.customDepartment;
      }
    }

    try {
      await usersAPI.update(editingUser._id, payload);
      toast.success('User updated successfully');
      handleCloseEdit();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update user');
    }
  };

  const roleLabel = (role) => {
    if (role === 'subcity_admin') return 'Sub city Admin';
    if (role === 'woreda_admin') return 'Woreda Admin';
    if (role === 'officer') return 'Officer';
    if (role === 'resident') return 'Resident';
    return role;
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter((user) => {
    if (!searchTerm.trim()) return true;

    const needle = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(needle) ||
      user.email?.toLowerCase().includes(needle) ||
      user.woreda?.toLowerCase().includes(needle) ||
      user.department?.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">User management</h1>
        <p className="text-gray-600 mt-2">View, filter, and manage all user accounts.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by role</label>
          <select
            className="input mt-1"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="subcity_admin">Sub city Admin</option>
            <option value="woreda_admin">Woreda Admin</option>
            <option value="officer">Officer</option>
            <option value="resident">Resident</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Search users</label>
          <input
            className="input mt-1"
            placeholder="Name, email, woreda, department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-600">
          No users found for the selected filters.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Woreda</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{roleLabel(user.role)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.woreda || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.department || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {user.isActive ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="text-primary-600 text-sm hover:text-primary-700 mr-4"
                      >
                        Edit
                      </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit user</h2>
              <button onClick={handleCloseEdit} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  className="input mt-1"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="input mt-1"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  className="input mt-1"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  className="input mt-1"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="subcity_admin">Sub city Admin</option>
                  <option value="woreda_admin">Woreda Admin</option>
                  <option value="officer">Officer</option>
                  <option value="resident">Resident</option>
                </select>
              </div>

              {(editForm.role === 'resident' || editForm.role === 'woreda_admin') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Woreda</label>
                  <input
                    className="input mt-1"
                    value={editForm.woreda}
                    onChange={(e) => setEditForm({ ...editForm, woreda: e.target.value })}
                  />
                </div>
              )}

              {editForm.role === 'officer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      className="input mt-1"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Access code</label>
                    <input
                      className="input mt-1"
                      value={editForm.accessCode}
                      onChange={(e) => setEditForm({ ...editForm, accessCode: e.target.value })}
                    />
                  </div>

                  {editForm.department === 'Other' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Custom department</label>
                      <input
                        className="input mt-1"
                        value={editForm.customDepartment}
                        onChange={(e) => setEditForm({ ...editForm, customDepartment: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Account status</label>
                <select
                  className="input mt-1"
                  value={editForm.isActive ? 'active' : 'pending'}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleCloseEdit} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
