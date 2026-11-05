import 'dotenv/config';
import { z } from 'zod';
import { validateInput } from '@/utils/validate-input.util';

const boolString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((v) => v === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVICE_NAME: z.string().min(1).default('calorie-api'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  TRUST_PROXY: boolString,
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),

  DEFAULT_DAILY_CALORIE_LIMIT: z.coerce.number().int().positive().default(2100),

  FDC_BASE_URL: z.url().default('https://api.nal.usda.gov/fdc/v1'),
  FDC_API_KEY: z.string().min(1).default('DEMO_KEY'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv): Env {
  const result = validateInput(envSchema, source);

  if (!result.success) {
    const problems = Object.entries(result.errors)
      .map(([field, message]) => `  - ${field}: ${message}`)
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  return result.data;
}

export const env: Env = loadEnv(process.env);