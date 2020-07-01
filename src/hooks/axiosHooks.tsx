import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// the mock server url right now, but should eventually be the payments api endpoint
const BASE_URL = 'http://localhost:9998';

const LOG_REQUESTS = true;

export enum PaymentStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  STOPPED = 'STOPPED',
  REFUNDED = 'REFUNDED',
}

export enum TransactionStatus {
  SUCCEEDED = 'SUCCEEDED',
}

export interface CommitmentsQueryParams {
  sortField?: string;
  sortDirection?: string;
  limit?: number;
  page?: number;
  statuses?: string;
  search?: string;
}

export interface CommitmentResponse {
  organizationId: string;
  id: string;
  creationTimestamp: string;
  startedTimestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  amountPaidToDate: number;
  pledgeAmount: null;
  currency: string;
  status: PaymentStatus;
  paymentMethod: {
    origin: string;
    originName: string;
    paymentGateway: string;
    paymentGatewayNickname: string;
    card: string;
    lastFour: string; // needs to be a string because there can be leading 0s
    expiration: string;
  };
  schedules: {
    id: string;
    nextPaymentTimestamp: string;
    recurringAmount: number;
    frequency: 'MONTH';
    status: PaymentStatus;
  }[];
  installments: [
    {
      transactionId: string;
      date: string;
      status: 'SUCCEEDED';
      amount: 10;
      currency: 'USD';
    }
  ];
  customFields: { [key: string]: string };
}

export interface TransactionResponse {
  id: string;
  metadata: {
    originType: string;
    originId: string;
    originDisplayName: string;
  };
  firstName: string;
  lastName: string;
  type: string;
  originalTransactionId: string;
  commitmentId: string;
  gatewayId: string;
  email: string;
  amount: number;
  amountRefunded: number;
  currencyCode: string;
  status: string;
  paymentType: string;
  mostRecentReceiptId: string;
  timestamp: string;
  createdAt: string;
  authorizedAt: string;
  cardData: {
    last4: string;
    brand: string;
    expirationYear: string;
    expirationMonth: string;
  };
}

const cache = {};

const outgoingRequests = {};

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCacheKey = (
  type: string,
  url: string,
  paramsStr: string
): string => {
  return type + '/' + url + '/' + paramsStr;
};

export const clearCache = (key: string): boolean => {
  if (cache[key]) {
    delete cache[key];
    return true;
  }
  return false;
};

export const useGet = function <QueryParamsType>(
  apiUrl: string,
  params?: QueryParamsType
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
      } else if (!outgoingRequests[cacheKey]) {
        try {
          outgoingRequests[cacheKey] = true;
          const response = await api.get(apiUrl, {
            params,
          });
          if (LOG_REQUESTS) {
            console.log('get', cacheKey, response.data);
          }
          setError(false);
          setData(response);
          setLoading(false);
          outgoingRequests[cacheKey] = false;
          cache[cacheKey] = response;
        } catch (e) {
          console.error('Failed to get', e);
          setError(true);
          setData(null);
          setLoading(false);
        }
      }
    };
    requestData();
  }, [apiUrl, params]);

  return [data, loading, error];
};

export const usePost = function <QueryParamsType, BodyParamsType>(
  apiUrl: string,
  params?: QueryParamsType,
  body?: BodyParamsType
): [AxiosResponse | null, boolean, boolean] {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const requestData = async () => {
      const cacheKey = getCacheKey(
        'POST',
        apiUrl,
        '[' + JSON.stringify(params) + ',' + JSON.stringify(body) + ']'
      );
      const cachedData = cache[cacheKey];
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        setError(false);
      } else if (!outgoingRequests[cacheKey]) {
        try {
          outgoingRequests[cacheKey] = true;
          const response = await api.post(apiUrl, {
            params,
            body,
          });
          if (LOG_REQUESTS) {
            console.log('post', cacheKey, response.data);
          }
          setError(false);
          setData(response);
          setLoading(false);
          outgoingRequests[cacheKey] = false;
          cache[cacheKey] = response;
        } catch (e) {
          console.error('Failed to post', e);
          setError(true);
          setData(null);
          setLoading(false);
        }
      }
    };
    requestData();
  }, [apiUrl, params, body]);

  return [data, loading, error];
};
