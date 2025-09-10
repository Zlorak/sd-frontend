import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Model, ModelFormData, Make, MakeModelCategory } from '@/types/inventory';
import { apiClient } from '@/services/api';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';

interface ModelManagerProps {
  category: MakeModelCategory;
}

export interface ModelManagerRef {
  refreshMakes: () => void;
}

export const ModelManager = forwardRef<ModelManagerRef, ModelManagerProps>(({ category }, ref) => {
  const [models, setModels] = useState<Model[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    make_id: '',
    category: category
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    setFormData(prev => ({ ...prev, category }));
  }, [category]);

  const refreshMakes = async () => {
    try {
      const makesResponse = await apiClient.getMakes(category);
      if (makesResponse.success && makesResponse.data) {
        setMakes(makesResponse.data);
      }
    } catch (err) {
      console.error('Failed to refresh makes:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshMakes
  }), [category]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [modelsResponse, makesResponse] = await Promise.all([
        apiClient.getModels(category),
        apiClient.getMakes(category)
      ]);

      if (modelsResponse.success && modelsResponse.data) {
        setModels(modelsResponse.data);
      }
      
      if (makesResponse.success && makesResponse.data) {
        setMakes(makesResponse.data);
      }

      if (!modelsResponse.success) {
        setError(modelsResponse.error || 'Failed to load models');
      } else if (!makesResponse.success) {
        setError(makesResponse.error || 'Failed to load makes');
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let response;
      if (editingModel) {
        response = await apiClient.updateModel(editingModel.id, formData);
      } else {
        response = await apiClient.createModel(formData);
      }

      if (response.success) {
        await loadData();
        resetForm();
      } else {
        setError(response.error || 'Failed to save model');
      }
    } catch (err) {
      setError('Failed to save model');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (model: Model) => {
    if (!confirm(`Are you sure you want to delete "${model.name}" by ${model.make_name}?`)) {
      return;
    }

    try {
      const response = await apiClient.deleteModel(model.id);
      if (response.success) {
        await loadData();
      } else {
        setError(response.error || 'Failed to delete model');
      }
    } catch (err) {
      setError('Failed to delete model');
    }
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      make_id: model.make_id,
      category: model.category
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', make_id: '', category });
    setEditingModel(null);
    setShowAddForm(false);
  };

  const categoryDisplayName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {categoryDisplayName} Models
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
          disabled={makes.length === 0}
        >
          {showAddForm ? 'Cancel' : 'Add Model'}
        </button>
      </div>

      {makes.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            You need to add at least one make before you can add models.
          </p>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {showAddForm && makes.length > 0 && (
        <div className="card p-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            {editingModel ? 'Edit Model' : 'Add New Model'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Make *</label>
              <select
                value={formData.make_id}
                onChange={(e) => setFormData(prev => ({ ...prev, make_id: e.target.value }))}
                required
                className="form-input w-full"
              >
                <option value="">Select a make</option>
                {makes.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Model Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="form-input w-full"
                placeholder={`Enter ${category} model name`}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Saving...' : (editingModel ? 'Update' : 'Add')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Make
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {model.make_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {model.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(model.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(model)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(model)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {models.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No models found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

ModelManager.displayName = 'ModelManager';