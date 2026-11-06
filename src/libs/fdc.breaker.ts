import CircuitBreaker from 'opossum';
import { breakerEvents, breakerState } from '@/observability/http.metric';
import { type FoodSuggestion, searchFoods } from './fdc.client';
import { logger } from '@/config/logger';

const NAME = 'fdc';

/**
 * FDC behind a circuit breaker. 
 */
export const fdcBreaker = new CircuitBreaker(searchFoods, {
  name: NAME,
  timeout: 8000,
  errorThresholdPercentage: 50,
  volumeThreshold: 5,
  rollingCountTimeout: 30_000,
  resetTimeout: 30_000,
});

breakerState.set({ name: NAME }, 0);

const STATE = { close: 0, halfOpen: 1, open: 2 } as const;
for (const event of ['success', 'failure', 'timeout', 'reject', 'open', 'close', 'halfOpen'] as const) {
  fdcBreaker.on(event as 'failure', () => {
    breakerEvents.inc({ name: NAME, event });
    if (event === 'open' || event === 'close' || event === 'halfOpen') {
      breakerState.set({ name: NAME }, STATE[event]);
      logger.warn('circuit breaker state changed', { breaker: NAME, event });
    }
  });
}

export const searchFoodsWithBreaker = (query: string, correlationId: string): Promise<FoodSuggestion[]> =>
  fdcBreaker.fire(query, correlationId);