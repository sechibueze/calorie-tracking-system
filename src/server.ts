import { createApp } from './app';
import { env } from '@/config/env';
import { logger } from './config/logger';
import { disconnectDB } from './database/db';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info('server started', { port: env.PORT, nodeEnv: env.NODE_ENV });
});

// Keep-alive above typical load balancer idle timeouts (60s) to avoid sporadic 502s.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;

function shutdown(signal: string, exitCode = 0): void {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('shutdown initiated', { signal });

  setTimeout(() => {
    logger.error('graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  server.close((err) => {
    if (err) {
      logger.error('error while closing server', { err });
      process.exit(1);
    }

    disconnectDB()
    .catch((closeErr: unknown) => logger.error('error while closing database', { closeErr }))
    .finally(() => {
      logger.info('shutdown complete');
      process.exit(exitCode);
    });
   
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('unhandled promise rejection', { reason });
  shutdown('unhandledRejection', 1);
});
process.on('uncaughtException', (err) => {
  logger.error('uncaught exception', { err });
  shutdown('uncaughtException', 1);
});