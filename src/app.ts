import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from '@/config/env';
import { httpMetrics, metricsHandler } from '@/observability/http.metric';
import { correlationIdMiddleware } from './middleware/correlationId.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import { healthRouter } from './routes/health.route';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error.middleware';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(correlationIdMiddleware);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS.includes('*') ? '*' : env.CORS_ORIGINS,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
      exposedHeaders: ['X-Correlation-Id', 'Retry-After'],
      maxAge: 600,
    }),
  );
  app.use(httpMetrics);
  app.use(requestLogger);
  app.use(express.json({ limit: '100kb' }));

  app.use('/health', healthRouter);
  app.get('/metrics', metricsHandler);
  app.use('/api/v1', apiRouter);

  app.use(errorHandler);

  return app;
}