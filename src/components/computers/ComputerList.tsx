import React, { useState } from 'react';
import { ComputerTable } from './ComputerTable';
import { ComputerForm } from './ComputerForm';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useOfficeFilter } from '@/hooks/useOfficeFilter';
import { Computer, ComputerFormData } from '@/types/inventory';
import { apiClient } from '@/services/api';

export const ComputerList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingComputer, setEditingComputer] = useState<Computer | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { getFilteredParams } = useOfficeFilter();
  const { data: computers, loading, error, retry } = useApi(
    () => apiClient.getComputers(getFilteredParams({ search: debouncedSearch })),
    [getFilteredParams, debouncedSearch]
  );
  
  const { mutate, loading: mutating, error: mutationError, setError: setMutationError } = useApiMutation<Computer, ComputerFormData>();
  const { mutate: deleteMutate } = useApiMutation<void, string>();

  const handleSubmit = async (data: ComputerFormData) => {
    const mutation = mutate(editingComputer 
      ? (data) => apiClient.updateComputer(editingComputer.id, data)
      : (data) => apiClient.createComputer(data)
    );
    
    const result = await mutation(data);
    if (result) {
      setShowForm(false);
      setEditingComputer(null);
      retry();
    }
  };

  const handleEdit = (computer: Computer) => {
    setMutationError(null);
    setEditingComputer(computer);
    setShowForm(true);
  };

  const handleDelete = async (computer: Computer) => {
    if (window.confirm('Are you sure you want to delete this computer?')) {
      const deletion = deleteMutate((id) => apiClient.deleteComputer(id));
      await deletion(computer.id);
      retry();
    }
  };

  const handleCancel = () => {
    setMutationError(null);
    setShowForm(false);
    setEditingComputer(null);
  };

  if (showForm) {
    return (
      <ComputerForm
        computer={editingComputer}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={mutating}
        error={mutationError}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Computers
        </h1>
        <button
          onClick={() => {
            setMutationError(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Computer
        </button>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by make or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-md"
        />
      </div>

      {loading && <Loading text="Loading computers..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {computers && (
        <ComputerTable
          computers={computers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};