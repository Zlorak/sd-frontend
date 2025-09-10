import React from 'react';
import { useOffice } from '@/contexts/OfficeContext';
import { Office } from '@/types/inventory';

export const OfficeSelector: React.FC = () => {
  const { selectedOffice, setSelectedOffice, offices } = useOffice();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="office-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Office:
      </label>
      <select
        id="office-select"
        value={selectedOffice || ''}
        onChange={(e) => setSelectedOffice(e.target.value ? (e.target.value as Office) : null)}
        className="form-input text-sm min-w-32"
      >
        <option value="">All Offices</option>
        {offices.map((office) => (
          <option key={office} value={office}>
            {office}
          </option>
        ))}
      </select>
    </div>
  );
};