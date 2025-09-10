import React, { useState, useEffect } from 'react';
import { RestockRequest, RestockRequestFormData, Make, Model } from '@/types/inventory';
import { apiClient } from '@/services/api';

interface RestockRequestFormProps {
  restockRequest?: RestockRequest | null;
  onSubmit: (data: RestockRequestFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const RestockRequestForm: React.FC<RestockRequestFormProps> = ({
  restockRequest,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RestockRequestFormData>({
    item_category: 'computers',
    item_description: '',
    make_id: '',
    model_id: '',
    quantity_requested: 1,
    office: 'Office 1',
    priority: 'normal',
    status: 'pending',
    requested_by: '',
    notes: '',
  });

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (restockRequest) {
      setFormData({
        item_category: restockRequest.item_category,
        item_description: restockRequest.item_description,
        make_id: restockRequest.make_id || '',
        model_id: restockRequest.model_id || '',
        quantity_requested: restockRequest.quantity_requested,
        office: restockRequest.office,
        priority: restockRequest.priority,
        status: restockRequest.status,
        requested_by: restockRequest.requested_by || '',
        notes: restockRequest.notes || '',
      });
    }
  }, [restockRequest]);

  // Load makes when category changes
  useEffect(() => {
    const loadMakes = async () => {
      if (!formData.item_category) return;
      
      let category: 'computer' | 'peripheral' | 'printer';
      switch (formData.item_category) {
        case 'computers':
          category = 'computer';
          break;
        case 'peripherals':
          category = 'peripheral';
          break;
        case 'printer_items':
          category = 'printer';
          break;
        default:
          return;
      }
      
      setLoadingMakes(true);
      try {
        const response = await apiClient.getMakes(category);
        if (response.success && response.data) {
          setMakes(response.data);
        }
      } catch (error) {
        console.error('Error loading makes:', error);
      } finally {
        setLoadingMakes(false);
      }
    };

    loadMakes();
    // Reset make and model when category changes
    setFormData(prev => ({ ...prev, make_id: '', model_id: '' }));
    setModels([]);
  }, [formData.item_category]);

  // Load models when make changes
  useEffect(() => {
    const loadModels = async () => {
      if (!formData.make_id) {
        setModels([]);
        return;
      }
      
      setLoadingModels(true);
      try {
        const response = await apiClient.getModels(undefined, formData.make_id);
        if (response.success && response.data) {
          setModels(response.data);
        }
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
    // Reset model when make changes
    setFormData(prev => ({ ...prev, model_id: '' }));
  }, [formData.make_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      make_id: formData.make_id || undefined,
      model_id: formData.model_id || undefined,
      requested_by: formData.requested_by || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity_requested' ? parseInt(value) || 1 : value,
    }));
  };


  return (
    <div className="card p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {restockRequest ? 'Edit Restock Request' : 'Create New Restock Request'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Item Category *</label>
            <select
              name="item_category"
              value={formData.item_category}
              onChange={handleChange}
              required
              className="form-input w-full"
            >
              <option value="computers">Computers</option>
              <option value="peripherals">Peripherals</option>
              <option value="printer_items">Printer Items</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Make</label>
            <select
              name="make_id"
              value={formData.make_id}
              onChange={handleChange}
              disabled={loadingMakes || makes.length === 0}
              className="form-input w-full"
            >
              <option value="">Select a make (optional)</option>
              {makes.map(make => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
            {loadingMakes && (
              <div className="loading-text">Loading makes...</div>
            )}
          </div>
          
          <div>
            <label className="form-label">Model</label>
            <select
              name="model_id"
              value={formData.model_id}
              onChange={handleChange}
              disabled={loadingModels || models.length === 0 || !formData.make_id}
              className="form-input w-full"
            >
              <option value="">Select a model (optional)</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {loadingModels && (
              <div className="loading-text">Loading models...</div>
            )}
            {!formData.make_id && (
              <div className="helper-text">Select a make first</div>
            )}
          </div>
          
          <div>
            <label className="form-label">Quantity Requested *</label>
            <input
              type="number"
              name="quantity_requested"
              value={formData.quantity_requested}
              onChange={handleChange}
              required
              min="1"
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label className="form-label">Office *</label>
            <select
              name="office"
              value={formData.office}
              onChange={handleChange}
              required
              className="form-input w-full"
            >
              <option value="Office 1">Office 1</option>
              <option value="Office 2">Office 2</option>
              <option value="Office 3">Office 3</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="form-input w-full"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="form-input w-full"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Requested By</label>
            <input
              type="text"
              name="requested_by"
              value={formData.requested_by}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="Enter name or email"
            />
          </div>
        </div>
        
        <div>
          <label className="form-label">Item Description *</label>
          <textarea
            name="item_description"
            value={formData.item_description}
            onChange={handleChange}
            required
            rows={3}
            className="form-input w-full"
            placeholder="Detailed description of the item needed..."
          />
        </div>
        
        <div>
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="form-input w-full"
            placeholder="Additional notes or specifications..."
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : (restockRequest ? 'Update' : 'Create')}
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