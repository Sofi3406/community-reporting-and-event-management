import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  useEffect(() => {
    profileForm.reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  }, [user, profileForm]);

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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 md:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">Edit profile</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-display text-slate-900">Update your details</h1>
        <p className="mt-2 text-slate-600">Keep your account information accurate and current.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
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
    </div>
  );
};

export default EditProfile;
