import React, { useState, useEffect } from 'react';
import { Make, MakeFormData, MakeModelCategory } from '@/types/inventory';
import { apiClient } from '@/services/api';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loading } from '@/components/common/Loading';

interface MakeManagerProps {
  category: MakeModelCategory;
  onMakeAdded?: (make: Make) => void;
}

export const MakeManager: React.FC<MakeManagerProps> = ({ category, onMakeAdded }) => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMake, setEditingMake] = useState<Make | null>(null);
  const [formData, setFormData] = useState<MakeFormData>({
    name: '',
    category: category
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMakes();
    setFormData(prev => ({ ...prev, category }));
  }, [category]);

  const loadMakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getMakes(category);
      if (response.success && response.data) {
        setMakes(response.data);
      } else {
        setError(response.error || 'Failed to load makes');
      }
    } catch (err) {
      setError('Failed to load makes');
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
      if (editingMake) {
        response = await apiClient.updateMake(editingMake.id, formData);
      } else {
        response = await apiClient.createMake(formData);
      }

      if (response.success && response.data) {
        await loadMakes();
        resetForm();
        if (!editingMake && onMakeAdded) {
          onMakeAdded(response.data);
        }
      } else {
        setError(response.error || 'Failed to save make');
      }
    } catch (err) {
      setError('Failed to save make');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (make: Make) => {
    if (!confirm(`Are you sure you want to delete "${make.name}"?`)) {
      return;
    }

    try {
      const response = await apiClient.deleteMake(make.id);
      if (response.success) {
        await loadMakes();
      } else {
        setError(response.error || 'Failed to delete make');
      }
    } catch (err) {
      setError('Failed to delete make');
    }
  };

  const handleEdit = (make: Make) => {
    setEditingMake(make);
    setFormData({
      name: make.name,
      category: make.category
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', category });
    setEditingMake(null);
    setShowAddForm(false);
  };

  const categoryDisplayName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {categoryDisplayName} Makes
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add Make'}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showAddForm && (
        <div className="card p-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            {editingMake ? 'Edit Make' : 'Add New Make'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="form-input w-full"
                placeholder={`Enter ${category} make name`}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Saving...' : (editingMake ? 'Update' : 'Add')}
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
                    Name
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
                {makes.map((make) => (
                  <tr key={make.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {make.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(make.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(make)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(make)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {makes.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No makes found. Add one to get started.
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
};