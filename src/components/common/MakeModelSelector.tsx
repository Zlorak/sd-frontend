import React, { useState, useEffect } from 'react';
import { Make, Model, MakeModelCategory } from '@/types/inventory';
import { apiClient } from '@/services/api';

interface MakeModelSelectorProps {
  category: MakeModelCategory;
  makeValue: string;
  modelValue: string;
  onMakeChange: (make: string) => void;
  onModelChange: (model: string) => void;
  makeName?: string;
  modelName?: string;
  disabled?: boolean;
  required?: boolean;
}

export const MakeModelSelector: React.FC<MakeModelSelectorProps> = ({
  category,
  makeValue,
  modelValue,
  onMakeChange,
  onModelChange,
  makeName = 'make',
  modelName = 'model',
  disabled = false,
  required = false,
}) => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadMakes();
  }, [category]);

  useEffect(() => {
    if (makeValue && makes.length > 0) {
      const make = makes.find(m => m.name === makeValue);
      if (make) {
        setSelectedMakeId(make.id);
        loadModels(make.id);
      }
    } else {
      setSelectedMakeId('');
      setModels([]);
      // Only clear the model if we're not initializing or if there's no existing model value
      if (!isInitializing || !modelValue) {
        onModelChange('');
      }
    }
    
    // Mark initialization as complete after the first time makes are loaded
    if (makes.length > 0 && isInitializing) {
      setIsInitializing(false);
    }
  }, [makeValue, makes, isInitializing, modelValue]);

  const loadMakes = async () => {
    setLoadingMakes(true);
    try {
      const response = await apiClient.getMakes(category);
      if (response.success && response.data) {
        setMakes(response.data);
      }
    } catch (error) {
      console.error('Failed to load makes:', error);
    } finally {
      setLoadingMakes(false);
    }
  };

  const loadModels = async (makeId: string) => {
    setLoadingModels(true);
    try {
      const response = await apiClient.getModels(category, makeId);
      if (response.success && response.data) {
        setModels(response.data);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const makeName = e.target.value;
    onMakeChange(makeName);
    setIsInitializing(false); // User interaction, no longer initializing
    
    if (!makeName) {
      setSelectedMakeId('');
      setModels([]);
      onModelChange('');
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModelChange(e.target.value);
  };

  return (
    <>
      <div>
        <label className="form-label">
          Make {required && '*'}
        </label>
        <select
          name={makeName}
          value={makeValue}
          onChange={handleMakeChange}
          required={required}
          disabled={disabled || loadingMakes}
          className="form-input w-full"
        >
          <option value="">
            {loadingMakes ? 'Loading makes...' : 'Select a make'}
          </option>
          {makes.map((make) => (
            <option key={make.id} value={make.name}>
              {make.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">
          Model {required && '*'}
        </label>
        <select
          name={modelName}
          value={modelValue}
          onChange={handleModelChange}
          required={required}
          disabled={disabled || loadingModels || !selectedMakeId}
          className="form-input w-full"
        >
          <option value="">
            {!selectedMakeId 
              ? 'Select a make first' 
              : loadingModels 
                ? 'Loading models...' 
                : 'Select a model'
            }
          </option>
          {models.map((model) => (
            <option key={model.id} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};