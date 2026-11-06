import type { Request, RequestHandler } from 'express';
import onHeaders from 'on-headers';
import {
  Gauge,
  Histogram,
  Counter,
  Registry,
  collectDefaultMetrics,
} from '@prometheus-io/client';

import { env } from '@/config/env';

export const registry = new Registry();

registry.setDefaultLabels({
  service: env.SERVICE_NAME,
});

collectDefaultMetrics({
  register: registry,
});

export const httpRequestDuration = new Histogram({
  name: 'http_server_request_duration_seconds',
  help: 'Duration of inbound HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

export const httpRequestsInFlight = new Gauge({
  name: 'http_server_requests_in_flight',
  help: 'Number of inbound HTTP requests currently being processed',
  registers: [registry],
});

/**
 * Route template (e.g. /api/v1/entries/:id)
 * keeps label cardinality bounded.
 */
const routeLabel = (req: Request): string =>
  req.route
    ? `${req.baseUrl}${String(req.route.path)}`
    : 'unmatched';

export const httpMetrics: RequestHandler = (req, res, next) => {
  if (req.path === '/metrics') {
    next();
    return;
  }

  httpRequestsInFlight.inc();

  const stopTimer = httpRequestDuration.startTimer();

  let route = 'unmatched';

  onHeaders(res, () => {
    route = routeLabel(req);
  });

  res.once('close', () => {
    httpRequestsInFlight.dec();

    stopTimer({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });
  });

  next();
};

export const metricsHandler: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    res.setHeader('Content-Type', registry.contentType);
    res.send(await registry.metrics());
  } catch (error) {
    next(error);
  }
};


export const outboundRequestDuration = new Histogram({
  name: 'outbound_http_request_duration_seconds',
  help: 'Duration of outbound HTTP calls by client, method and status',
  labelNames: ['client', 'method', 'status'] as const,
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

export const outboundRetries = new Counter({
  name: 'outbound_http_retries_total',
  help: 'Outbound HTTP calls that were retried',
  labelNames: ['client'] as const,
  registers: [registry],
});

export const breakerState = new Gauge({
  name: 'circuit_breaker_state',
  help: 'Circuit breaker state: 0 closed, 1 half-open, 2 open',
  labelNames: ['name'] as const,
  registers: [registry],
});

export const breakerEvents = new Counter({
  name: 'circuit_breaker_events_total',
  help: 'Circuit breaker events (success, failure, timeout, reject, open, close, halfOpen)',
  labelNames: ['name', 'event'] as const,
  registers: [registry],
});