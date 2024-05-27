import React, { useCallback, useEffect, useState } from 'react';

/**
 *
 * @param {{key: string, fn: (params?:any) => Promise<any>, options: any}} param0
 * @returns {{data: any; loading: boolean; error?: string}}
 */
export const useDelay = ({ key = [], fn, options }) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryData = useCallback(async () => {
    setLoading(true);
    const res = await fn();
    setData(res?.data || []);
    setLoading(false);
  }, [fn]);

  useEffect(() => {
    try {
      queryData();
    } catch (error) {
      /**
       * handle error here
       */
      setLoading(false);
      setError(error?.message || error || 'Error');
    }
  }, key);

  const refetch = useCallback(() => {
    try {
      queryData();
    } catch (error) {
      /**
       * handle error here
       */
      setLoading(false);
      setError(error?.message || error || 'Error');
    }
  }, []);

  return { data, loading, error, refetch };
};
