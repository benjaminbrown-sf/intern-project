import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// the mock server url right now, but should eventually be the payments api endpoint
const BASE_URL = 'http://localhost:9998';

export interface CommitmentsQueryParams {
  sortField?: string;
  sortDirection?: string;
  limit?: number;
  page?: number;
  statuses?: string;
  search?: string;
}

const cache = {};

const getCacheKey = (type: string, url: string, paramsStr: string): string => {
  return type + '/' + url + '/' + paramsStr;
};

const api = axios.create({
  baseURL: BASE_URL,
});

export const useGet = function <QueryParamsType>(
  apiUrl: string,
  params: QueryParamsType
): [AxiosResponse | null, boolean, boolean] {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const requestData = async () => {
      const cacheKey = getCacheKey('GET', apiUrl, JSON.stringify(params));
      const cachedData = cache[cacheKey];
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        setError(false);
      } else {
        try {
          const response = await api.get(apiUrl, {
            params,
          });
          setData(response);
          setLoading(false);
          setError(false);
          cache[cacheKey] = response;
        } catch (e) {
          console.error('Failed to get', e);
          setData(null);
          setLoading(false);
          setError(true);
        }
      }
    };
    requestData();
  }, [apiUrl, params]);

  return [data, loading, error];
};
