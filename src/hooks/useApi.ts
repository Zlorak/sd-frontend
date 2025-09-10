import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/inventory';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success && response.data !== undefined) {
        setData(response.data);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const retry = () => {
    fetchData();
  };

  return { data, loading, error, retry };
}

export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = (
    apiCall: (params: P) => Promise<ApiResponse<T>>
  ) => {
    return async (params: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall(params);
        
        if (response.success && response.data !== undefined) {
          return response.data;
        } else {
          setError(response.error || 'An error occurred');
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    };
  };

  return { mutate, loading, error, setError };
}