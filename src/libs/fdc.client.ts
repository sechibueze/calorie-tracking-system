import { env } from '@/config/env';
import { createHttpClient } from '@/libs/http-client.lib';

export interface FoodSuggestion {
  fdcId: number;
  name: string;
  brand: string | null;
  caloriesPer100g: number | null;
}

interface FdcNutrient {
  nutrientId?: number;
  nutrientNumber?: string;
  unitName?: string;
  value?: number;
}

interface FdcFood {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: FdcNutrient[];
}

const http = createHttpClient({
  name: 'fdc',
  baseURL: env.FDC_BASE_URL,
  timeoutMs: 3000,
  retries: 2,
});

const ENERGY_KCAL_ID = 1008;

const caloriesOf = (food: FdcFood): number | null => {
  const energy = food.foodNutrients?.find(
    (n) => n.nutrientId === ENERGY_KCAL_ID || (n.nutrientNumber === '208' && n.unitName === 'KCAL'),
  );
  return typeof energy?.value === 'number' ? Math.round(energy.value) : null;
};

export async function searchFoods(query: string, correlationId: string): Promise<FoodSuggestion[]> {
  const { data } = await http.get<{ foods?: FdcFood[] }>('/foods/search', {
    params: { query, pageSize: 10, dataType: 'Foundation,SR Legacy,Branded', api_key: env.FDC_API_KEY },
    headers: { 'x-correlation-id': correlationId },
  });

  const seen = new Set<string>();
  const suggestions: FoodSuggestion[] = [];
  for (const food of data.foods ?? []) {
    const name = food.description.trim();
    const brand = food.brandName ?? food.brandOwner ?? null;
    const dedupe = `${name.toLowerCase()}|${brand ?? ''}`;
    if (!name || seen.has(dedupe)) continue;
    seen.add(dedupe);
    suggestions.push({ fdcId: food.fdcId, name, brand, caloriesPer100g: caloriesOf(food) });
  }
  return suggestions;
}