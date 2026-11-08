import { logger } from '@/config/logger';
import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { outboundRequestDuration, outboundRetries } from '@/observability/http.metric';

export interface HttpClientOptions {
  name: string;
  baseURL: string;
  timeoutMs?: number;
  retries: number;
  retryDelayMs?: number;
}

const startedAt = Symbol('startedAt');

/**
 * Axios instance with a timeout, retries (network errors, 429 and 5xx, with backoff) and metrics
 * for every attempt.
 */
export function createHttpClient(options: HttpClientOptions): AxiosInstance {
  const client = axios.create({ baseURL: options.baseURL, timeout: options.timeoutMs });
  const delay = options.retryDelayMs ?? 100;

  axiosRetry(client, {
    retries: options.retries,
    retryDelay: (attempt) => attempt * delay,
    retryCondition: (err) =>
      axiosRetry.isNetworkError(err) || err.response?.status === 429 || (err.response?.status ?? 0) >= 500,
    onRetry: (attempt, err) => {
      logger.warn('retrying outbound request', { client: options.name, attempt, reason: err.message });
    },
  });

  client.interceptors.request.use((config) => {
    (config as unknown as Record<symbol, number>)[startedAt] = Date.now();
    return config;
  });

  const observe = (config: unknown, status: string): void => {
    const start = (config as Record<symbol, number> | undefined)?.[startedAt];
    if (!start || !config) return;
    const method = String((config as { method?: string }).method ?? 'get').toUpperCase();
    outboundRequestDuration.observe({ client: options.name, method, status }, (Date.now() - start) / 1000);
  };

  client.interceptors.response.use(
    (res) => {
      return res;
    },
    (err: unknown) => {
      if (axios.isAxiosError(err)) observe(err.config, err.response ? String(err.response.status) : 'error');
      return Promise.reject(err);
    },
  );

  return client;
}