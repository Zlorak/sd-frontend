import React, { useState, useEffect } from 'react';
import { PrinterItem, PrinterItemFormData } from '@/types/inventory';
import { MakeModelSelector } from '@/components/common/MakeModelSelector';

interface PrinterItemFormProps {
  printerItem?: PrinterItem | null;
  onSubmit: (data: PrinterItemFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PrinterItemForm: React.FC<PrinterItemFormProps> = ({
  printerItem,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PrinterItemFormData>({
    item_type: '',
    make: '',
    model: '',
    quantity: 1,
    office: 'Office 1',
    status: 'active',
  });

  useEffect(() => {
    if (printerItem) {
      setFormData({
        item_type: printerItem.item_type,
        make: printerItem.make || '',
        model: printerItem.model || '',
        quantity: printerItem.quantity,
        office: printerItem.office,
        status: printerItem.status,
      });
    }
  }, [printerItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      make: formData.make || undefined,
      model: formData.model || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };

  const commonItemTypes = [
    'Ink Cartridge',
    'Toner Cartridge',
    'Paper',
    'Printer Cable',
    'Maintenance Kit',
    'Drum Unit',
    'Fuser Unit',
    'Transfer Belt',
    'Other'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">
        {printerItem ? 'Edit Printer Item' : 'Add New Printer Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-grid">
          <div>
            <label className="form-label">Item Type *</label>
            <select
              name="item_type"
              value={formData.item_type}
              onChange={handleChange}
              required
              className="form-input full-width"
            >
              <option value="">Select item type</option>
              {commonItemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <MakeModelSelector
            category="printer"
            makeValue={formData.make || ''}
            modelValue={formData.model || ''}
            onMakeChange={(make) => setFormData(prev => ({ ...prev, make: make || undefined }))}
            onModelChange={(model) => setFormData(prev => ({ ...prev, model: model || undefined }))}
            disabled={loading}
          />
          
          <div>
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="form-input full-width"
            />
          </div>
          
          <div>
            <label className="form-label">Office *</label>
            <select
              name="office"
              value={formData.office}
              onChange={handleChange}
              required
              className="form-input full-width"
            >
              <option value="Office 1">Office 1</option>
              <option value="Office 2">Office 2</option>
              <option value="Office 3">Office 3</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="form-input full-width"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : (printerItem ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};