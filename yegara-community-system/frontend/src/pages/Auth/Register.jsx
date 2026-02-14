import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      role: 'resident'
    }
  });

  const role = watch('role');

  const getDashboardLink = (selectedRole) => {
    switch (selectedRole) {
      case 'resident':
        return '/resident/dashboard';
      case 'officer':
        return '/officer/dashboard';
      case 'woreda_admin':
        return '/woreda-admin/dashboard';
      case 'subcity_admin':
        return '/subcity-admin/dashboard';
      default:
        return '/';
    }
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone || undefined,
      role: data.role,
      woreda: data.woreda || undefined,
      department: data.department || undefined
    };

    try {
      await registerUser(payload);
      navigate(getDashboardLink(data.role));
    } catch (error) {
      // handled in auth context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-3 text-gray-600">
              Join Yegara to report issues, access local resources, and participate in community events.
            </p>

            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Why register?</h2>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>Track report status in real time</li>
                <li>Get notified about community events</li>
                <li>Access official resources by woreda</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  className="input mt-1"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="input mt-1"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  type="tel"
                  className="input mt-1"
                  {...register('phone')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    className="input mt-1"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                  <input
                    type="password"
                    className="input mt-1"
                    {...register('confirmPassword', { required: 'Please confirm password' })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="input mt-1" {...register('role')}>
                  <option value="resident">Resident</option>
                  <option value="officer">Department Officer</option>
                  <option value="woreda_admin">Woreda Admin</option>
                  <option value="subcity_admin">Sub-City Admin</option>
                </select>
              </div>

              {(role === 'resident' || role === 'woreda_admin') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Woreda</label>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="e.g. Woreda 05"
                    {...register('woreda', { required: 'Woreda is required' })}
                  />
                  {errors.woreda && (
                    <p className="mt-1 text-sm text-red-600">{errors.woreda.message}</p>
                  )}
                </div>
              )}

              {role === 'officer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    className="input mt-1"
                    {...register('department', { required: 'Department is required' })}
                  >
                    <option value="">Select department</option>
                    <option value="Water">Water</option>
                    <option value="Road">Road</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                  )}
                </div>
              )}

              {role !== 'resident' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Admin and officer accounts require activation. You will receive an activation email after registration.
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
