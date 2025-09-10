import React, { useState } from 'react';
import { PeripheralTable } from './PeripheralTable';
import { PeripheralForm } from './PeripheralForm';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useOfficeFilter } from '@/hooks/useOfficeFilter';
import { Peripheral, PeripheralFormData } from '@/types/inventory';
import { apiClient } from '@/services/api';

export const PeripheralList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPeripheral, setEditingPeripheral] = useState<Peripheral | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { getFilteredParams } = useOfficeFilter();
  const { data: peripherals, loading, error, retry } = useApi(
    () => apiClient.getPeripherals(getFilteredParams({ search: debouncedSearch })),
    [getFilteredParams, debouncedSearch]
  );
  
  const { mutate, loading: mutating, error: mutationError, setError: setMutationError } = useApiMutation<Peripheral, PeripheralFormData>();
  const { mutate: deleteMutate } = useApiMutation<void, string>();

  const handleSubmit = async (data: PeripheralFormData) => {
    const mutation = mutate(editingPeripheral 
      ? (data) => apiClient.updatePeripheral(editingPeripheral.id, data)
      : (data) => apiClient.createPeripheral(data)
    );
    
    const result = await mutation(data);
    if (result) {
      setShowForm(false);
      setEditingPeripheral(null);
      retry();
    }
  };

  const handleEdit = (peripheral: Peripheral) => {
    setEditingPeripheral(peripheral);
    setShowForm(true);
  };

  const handleDelete = async (peripheral: Peripheral) => {
    if (window.confirm('Are you sure you want to delete this peripheral?')) {
      const deletion = deleteMutate((id) => apiClient.deletePeripheral(id));
      await deletion(peripheral.id);
      retry();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPeripheral(null);
  };

  if (showForm) {
    return (
      <PeripheralForm
        peripheral={editingPeripheral}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={mutating}
        error={mutationError}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Peripherals
        </h1>
        <button
          onClick={() => {
            setMutationError(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Peripheral
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, make, or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <Loading text="Loading peripherals..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {peripherals && (
        <PeripheralTable
          peripherals={peripherals}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};