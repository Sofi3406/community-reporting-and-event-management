import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { resourcesAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const UploadResource = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'Other',
    file: null
  });
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const response = await resourcesAPI.getAll({ sort: '-createdAt', limit: 100 });
      setResources(response.data?.data || []);
    } catch (error) {
      toast.error('Unable to load uploaded resources');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

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
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to upload resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const myResources = useMemo(() => {
    return resources.filter((resource) => {
      const ownerId = typeof resource.uploadedBy === 'object'
        ? resource.uploadedBy?._id
        : resource.uploadedBy;

      return String(ownerId || '') === String(user?._id || '');
    });
  }, [resources, user?._id]);

  const handleOpenEdit = (resource) => {
    setEditingResource(resource);
    setEditForm({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || 'Other',
      file: null
    });
  };

  const handleCloseEdit = () => {
    setEditingResource(null);
    setEditForm({ title: '', description: '', category: 'Other', file: null });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingResource) return;

    if (!editForm.title) {
      toast.error('Title is required');
      return;
    }

    const payload = new FormData();
    payload.append('title', editForm.title);
    payload.append('description', editForm.description || '');
    payload.append('category', editForm.category || 'Other');
    if (editForm.file) {
      payload.append('file', editForm.file);
    }

    try {
      await resourcesAPI.update(editingResource._id, payload);
      toast.success('Resource updated successfully');
      handleCloseEdit();
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update resource');
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Delete this resource?')) return;

    try {
      await resourcesAPI.delete(resourceId);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to delete resource');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-white via-primary-50 to-sky-50 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Upload resource</h1>
        <p className="text-gray-600 mt-2">Share documents and guides with residents.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
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
          <div className="mt-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4">
            <input type="file" className="w-full text-sm text-gray-700" {...register('file', { required: 'File is required' })} />
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Uploading...' : 'Upload resource'}
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Previously uploaded resources</h2>
          <button
            type="button"
            onClick={fetchResources}
            className="inline-flex items-center rounded-lg border border-gray-300 text-gray-700 text-sm font-medium px-3 py-1.5 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loadingResources ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : myResources.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">You have not uploaded resources yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {myResources.map((resource) => (
              <div key={resource._id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/40">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{resource.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {resource.category || 'Other'} · {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{resource.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(resource)}
                      className="inline-flex items-center rounded-lg border border-primary-200 text-primary-700 text-sm font-medium px-3 py-1.5 hover:bg-primary-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(resource._id)}
                      className="inline-flex items-center rounded-lg border border-red-200 text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit resource</h2>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="inline-flex items-center rounded-lg border border-gray-200 text-gray-600 text-sm font-medium px-3 py-1.5 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  className="input mt-1"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="input mt-1"
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="input mt-1"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="Document">Document</option>
                  <option value="Guide">Guide</option>
                  <option value="Notice">Notice</option>
                  <option value="Form">Form</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Replace file (optional)</label>
                <div className="mt-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4">
                  <input
                    type="file"
                    className="w-full text-sm text-gray-700"
                    onChange={(e) => setEditForm({ ...editForm, file: e.target.files?.[0] || null })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
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

export default UploadResource;
