import React, { useState } from 'react';
import { PrinterItemTable } from './PrinterItemTable';
import { PrinterItemForm } from './PrinterItemForm';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useOfficeFilter } from '@/hooks/useOfficeFilter';
import { PrinterItem, PrinterItemFormData } from '@/types/inventory';
import { apiClient } from '@/services/api';

export const PrinterItemList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPrinterItem, setEditingPrinterItem] = useState<PrinterItem | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { getFilteredParams } = useOfficeFilter();
  const { data: printerItems, loading, error, retry } = useApi(
    () => apiClient.getPrinterItems(getFilteredParams({ search: debouncedSearch })),
    [getFilteredParams, debouncedSearch]
  );
  
  const { mutate, loading: mutating } = useApiMutation<PrinterItem, PrinterItemFormData>();
  const { mutate: deleteMutate } = useApiMutation<void, string>();

  const handleSubmit = async (data: PrinterItemFormData) => {
    const mutation = mutate(editingPrinterItem 
      ? (data) => apiClient.updatePrinterItem(editingPrinterItem.id, data)
      : (data) => apiClient.createPrinterItem(data)
    );
    
    const result = await mutation(data);
    if (result) {
      setShowForm(false);
      setEditingPrinterItem(null);
      retry();
    }
  };

  const handleEdit = (printerItem: PrinterItem) => {
    setEditingPrinterItem(printerItem);
    setShowForm(true);
  };

  const handleDelete = async (printerItem: PrinterItem) => {
    if (window.confirm('Are you sure you want to delete this printer item?')) {
      const deletion = deleteMutate((id) => apiClient.deletePrinterItem(id));
      await deletion(printerItem.id);
      retry();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrinterItem(null);
  };

  if (showForm) {
    return (
      <PrinterItemForm
        printerItem={editingPrinterItem}
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
          Printer Items
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add Printer Item
        </button>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by type, make, or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-md"
        />
      </div>

      {loading && <Loading text="Loading printer items..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {printerItems && (
        <PrinterItemTable
          printerItems={printerItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};