import winston from 'winston';
import { env } from '@/config/env';

const isProduction = env.NODE_ENV === 'production';

const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const meta = Object.keys(metadata).length
      ? ` ${JSON.stringify(metadata)}`
      : '';

    return `${timestamp} [${level}]: ${message}${meta}`;
  }),
);

const productionFormat = winston.format.combine(
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,

  defaultMeta: {
    service: env.SERVICE_NAME,
  },

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
  ),

  transports: [
    new winston.transports.Console({
      format: isProduction
        ? productionFormat
        : developmentFormat,
    }),
  ],

  exitOnError: false,
});