import { useCallback } from 'react';
import { useOffice } from '@/contexts/OfficeContext';
import { QueryParams } from '@/types/inventory';

export function useOfficeFilter() {
  const { selectedOffice } = useOffice();

  const getFilteredParams = useCallback((additionalParams: Omit<QueryParams, 'office'> = {}): QueryParams => {
    return {
      ...additionalParams,
      ...(selectedOffice && { office: selectedOffice }),
    };
  }, [selectedOffice]);

  return {
    selectedOffice,
    getFilteredParams,
  };
}