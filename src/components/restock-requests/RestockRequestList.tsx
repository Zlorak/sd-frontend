import React, { useState } from 'react';
import { RestockRequestTable } from './RestockRequestTable';
import { RestockRequestForm } from './RestockRequestForm';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useOfficeFilter } from '@/hooks/useOfficeFilter';
import { RestockRequest, RestockRequestFormData, ItemCategory, Priority, RestockStatus } from '@/types/inventory';
import { apiClient } from '@/services/api';

export const RestockRequestList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RestockRequest | null>(null);
  const [filters, setFilters] = useState({
    status: '' as RestockStatus | '',
    priority: '' as Priority | '',
    category: '' as ItemCategory | '',
  });
  
  const { getFilteredParams } = useOfficeFilter();
  const { data: restockRequests, loading, error, retry } = useApi(
    () => {
      const baseParams = getFilteredParams();
      return apiClient.getRestockRequests({
        office: baseParams.office,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.category && { item_category: filters.category }),
      });
    },
    [getFilteredParams, filters]
  );
  
  const { mutate, loading: mutating } = useApiMutation<RestockRequest, RestockRequestFormData>();
  const { mutate: deleteMutate } = useApiMutation<void, string>();

  const handleSubmit = async (data: RestockRequestFormData) => {
    const mutation = mutate(editingRequest 
      ? (data) => apiClient.updateRestockRequest(editingRequest.id, data)
      : (data) => apiClient.createRestockRequest(data)
    );
    
    const result = await mutation(data);
    if (result) {
      setShowForm(false);
      setEditingRequest(null);
      retry();
    }
  };

  const handleEdit = (request: RestockRequest) => {
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleDelete = async (request: RestockRequest) => {
    if (window.confirm('Are you sure you want to delete this restock request?')) {
      const deletion = deleteMutate((id) => apiClient.deleteRestockRequest(id));
      const result = await deletion(request.id);
      if (result !== null) {
        retry();
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRequest(null);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
    });
  };

  if (showForm) {
    return (
      <RestockRequestForm
        restockRequest={editingRequest}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={mutating}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Restock Requests
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          New Request
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="form-label text-sm">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-input text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="form-label text-sm">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="form-input text-sm"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="form-label text-sm">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-input text-sm"
            >
              <option value="">All Categories</option>
              <option value="computers">Computers</option>
              <option value="peripherals">Peripherals</option>
              <option value="printer_items">Printer Items</option>
            </select>
          </div>
          
          <div className="mt-5">
            <button
              onClick={clearFilters}
              className="btn-secondary text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading text="Loading restock requests..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {restockRequests && (
        <RestockRequestTable
          restockRequests={restockRequests}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};