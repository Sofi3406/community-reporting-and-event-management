import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const roleLabels = {
    resident: 'Resident',
    officer: 'Officer',
    woreda_admin: 'Woreda Admin',
    subcity_admin: 'Sub-City Admin'
  };

  const profileForm = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const passwordForm = useForm();

  const handleProfileSubmit = async (data) => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', {
        message: 'Passwords do not match'
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      passwordForm.reset();
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">Profile</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-display text-slate-900">Manage your account</h1>
            <p className="mt-2 text-slate-600">Update your personal details and secure your account.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-semibold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{user?.fullName || 'User'}</p>
              <p className="text-sm text-slate-600">{user?.email || 'No email on file'}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Role</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {roleLabels[user?.role] || 'Member'}
            </p>
          </div>
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Woreda</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {user?.woreda || 'Not set'}
            </p>
          </div>
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Department</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {user?.department || 'Not assigned'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                className="input mt-1"
                {...profileForm.register('fullName', { required: 'Full name is required' })}
              />
              {profileForm.formState.errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {profileForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="input mt-1"
                {...profileForm.register('email', { required: 'Email is required' })}
              />
              {profileForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                type="tel"
                className="input mt-1"
                {...profileForm.register('phone')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Current password</label>
              <input
                type="password"
                className="input mt-1"
                {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <input
                type="password"
                className="input mt-1"
                {...passwordForm.register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' }
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm new password</label>
              <input
                type="password"
                className="input mt-1"
                {...passwordForm.register('confirmPassword', { required: 'Confirm password is required' })}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-slate-900 py-3 rounded-xl font-semibold hover:bg-amber-400 disabled:opacity-60"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
