import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// just a test url right now, but should eventually be the payments api endpoint
const BASE_URL = 'https://jsonplaceholder.typicode.com';

const cache = {};

const getCacheKey = (type: string, url: string): string => {
  return type + '/' + url;
};

const api = axios.create({
  baseURL: BASE_URL,
});

export const useGet = (
  apiUrl: string
): [AxiosResponse | null, boolean, boolean] => {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const requestData = async () => {
      const cachedData = cache[getCacheKey('GET', apiUrl)];
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        setError(false);
      } else {
        try {
          const response = await api.get(apiUrl);
          setData(response);
          setLoading(false);
          setError(false);
        } catch (e) {
          console.error('Failed to get', e);
          setData(null);
          setLoading(false);
          setError(true);
        }
      }
    };
    requestData();
  });

  return [data, loading, error];
};
