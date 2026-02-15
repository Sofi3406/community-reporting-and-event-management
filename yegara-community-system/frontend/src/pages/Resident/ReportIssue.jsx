import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { reportsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const ReportIssue = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const categorySelection = watch('category');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      if (data.customCategory) {
        formData.append('customCategory', data.customCategory);
      }
      formData.append('description', data.description);
      formData.append('location', data.location || '');

      if (data.images?.length) {
        Array.from(data.images).forEach((file) => {
          formData.append('images', file);
        });
      }

      await reportsAPI.create(formData);
      toast.success('Report submitted successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold text-gray-900">Report a community issue</h1>
      <p className="text-gray-600 mt-2">Provide details so the right department can respond quickly.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="input mt-1"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="input mt-1"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select category</option>
            <option value="Water">Water</option>
            <option value="Road">Road</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {categorySelection === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Category type</label>
            <input
              className="input mt-1"
              placeholder="Describe the category"
              {...register('customCategory', {
                required: 'Category type is required',
                minLength: { value: 2, message: 'Enter at least 2 characters' }
              })}
            />
            {errors.customCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.customCategory.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            className="input mt-1"
            placeholder="Optional location or landmark"
            {...register('location')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows="5"
            className="input mt-1"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supporting images (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-2"
            {...register('images')}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit report'}
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
