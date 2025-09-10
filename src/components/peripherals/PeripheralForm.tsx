import React, { useState, useEffect } from 'react';
import { Peripheral, PeripheralFormData } from '@/types/inventory';
import { MakeModelSelector } from '@/components/common/MakeModelSelector';

interface PeripheralFormProps {
  peripheral?: Peripheral | null;
  onSubmit: (data: PeripheralFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const PeripheralForm: React.FC<PeripheralFormProps> = ({
  peripheral,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<PeripheralFormData>({
    item_name: '',
    make: '',
    model: '',
    serial_numbers: [],
    quantity: 1,
    office: 'Office 1',
    status: 'active',
  });
  
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (peripheral) {
      const serialNumbers = peripheral.serial_numbers?.map(sn => sn.serial_number) || [];
      // Ensure serial numbers array matches quantity
      while (serialNumbers.length < peripheral.quantity) {
        serialNumbers.push('');
      }
      
      setFormData({
        item_name: peripheral.item_name,
        make: peripheral.make || '',
        model: peripheral.model || '',
        serial_numbers: serialNumbers,
        quantity: peripheral.quantity,
        office: peripheral.office,
        status: peripheral.status,
      });
    } else {
      // Clear validation errors when starting a new form
      setValidationErrors({});
    }
  }, [peripheral]);

  // Initialize serial numbers array when component mounts or quantity changes from initial state
  useEffect(() => {
    if (!peripheral && formData.serial_numbers.length === 0 && formData.quantity > 0) {
      setFormData(prev => ({
        ...prev,
        serial_numbers: Array(prev.quantity).fill(''),
      }));
    }
  }, [formData.quantity, peripheral]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Check for duplicate serial numbers within the form
    const serialNumbers = formData.serial_numbers.filter(sn => sn.trim() !== '');
    const duplicateSerials = serialNumbers.filter((serial, index, arr) => 
      arr.indexOf(serial) !== index
    );
    
    if (duplicateSerials.length > 0) {
      setValidationErrors({
        duplicate_serials: `Duplicate serial numbers found: ${duplicateSerials.join(', ')}`
      });
      return;
    }
    
    onSubmit({
      ...formData,
      make: formData.make || undefined,
      model: formData.model || undefined,
      serial_numbers: serialNumbers,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setFormData(prev => {
      const currentSerialNumbers = [...prev.serial_numbers];
      
      // Adjust serial numbers array based on new quantity
      if (newQuantity > currentSerialNumbers.length) {
        // Add empty strings for new serial number fields
        while (currentSerialNumbers.length < newQuantity) {
          currentSerialNumbers.push('');
        }
      } else if (newQuantity < currentSerialNumbers.length) {
        // Trim the array to match the new quantity
        currentSerialNumbers.splice(newQuantity);
      }
      
      return {
        ...prev,
        quantity: newQuantity,
        serial_numbers: currentSerialNumbers,
      };
    });
  };

  const handleSerialNumberChange = (index: number, value: string) => {
    // Clear validation errors when user changes input
    if (validationErrors.duplicate_serials) {
      setValidationErrors(prev => ({
        ...prev,
        duplicate_serials: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      serial_numbers: prev.serial_numbers.map((sn, i) => i === index ? value : sn),
    }));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {peripheral ? 'Edit Peripheral' : 'Add New Peripheral'}
      </h2>
      
      {(error || validationErrors.duplicate_serials) && (
        <div className="error-message">
          <p className="error-text">
            {error || validationErrors.duplicate_serials}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-grid">
          <div>
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              className="form-input full-width"
              placeholder="e.g., Keyboard, Mouse, Monitor"
            />
          </div>
          
          <MakeModelSelector
            category="peripheral"
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
              onChange={handleQuantityChange}
              required
              min="1"
              className="form-input full-width"
            />
          </div>
        </div>
        
        {formData.quantity > 0 && (
          <div className="serial-numbers-section">
            <label className="form-label">Serial Numbers (one per item)</label>
            <div className="serial-numbers-grid">
              {Array.from({ length: formData.quantity }, (_, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={formData.serial_numbers[index] || ''}
                    onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                    className="form-input full-width"
                    placeholder={`Serial Number ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="form-grid">
          
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
            {loading ? 'Saving...' : (peripheral ? 'Update' : 'Create')}
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