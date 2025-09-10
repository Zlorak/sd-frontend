import React, { createContext, useContext, useState } from 'react';
import { Office, OfficeContextType } from '@/types/inventory';

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const useOffice = () => {
  const context = useContext(OfficeContext);
  if (context === undefined) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
};

interface OfficeProviderProps {
  children: React.ReactNode;
}

export const OfficeProvider: React.FC<OfficeProviderProps> = ({ children }) => {
  const offices: Office[] = ['Office 1', 'Office 2', 'Office 3'];
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sd-inventory-selected-office');
      if (stored && offices.includes(stored as Office)) {
        return stored as Office;
      }
    }
    return null;
  });

  const handleSetSelectedOffice = (office: Office | null) => {
    setSelectedOffice(office);
    if (office) {
      localStorage.setItem('sd-inventory-selected-office', office);
    } else {
      localStorage.removeItem('sd-inventory-selected-office');
    }
  };

  return (
    <OfficeContext.Provider
      value={{
        selectedOffice,
        setSelectedOffice: handleSetSelectedOffice,
        offices,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};