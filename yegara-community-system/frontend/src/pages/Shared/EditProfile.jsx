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
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Edit profile</h1>
        <p className="text-gray-600 mt-2">Complete your profile details.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900">Personal details</h2>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
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
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="input mt-1"
              {...profileForm.register('phone')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
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
