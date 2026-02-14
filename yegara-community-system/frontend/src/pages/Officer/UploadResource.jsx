import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resourcesAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const UploadResource = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('category', data.category || 'Other');
      formData.append('file', data.file[0]);

      await resourcesAPI.create(formData);
      toast.success('Resource uploaded successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to upload resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold text-gray-900">Upload resource</h1>
      <p className="text-gray-600 mt-2">Share documents and guides with residents.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input className="input mt-1" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="input mt-1" rows="4" {...register('description')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select className="input mt-1" {...register('category')}>
            <option value="Document">Document</option>
            <option value="Guide">Guide</option>
            <option value="Notice">Notice</option>
            <option value="Form">Form</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input type="file" className="mt-2" {...register('file', { required: 'File is required' })} />
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Uploading...' : 'Upload resource'}
        </button>
      </form>
    </div>
  );
};

export default UploadResource;
