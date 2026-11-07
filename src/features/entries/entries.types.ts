export interface Entry {
  id: string;
  name: string;
  calories: number;
  consumedAt: string;
  fdcId: number | null;
  brand: string | null;
  quantityGrams: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EntriesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  dailyLimit?: number;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  entryCount: number;
  dailyLimit: number;
  limitReached: boolean;
  overBy: number;
}

export interface FoodSuggestion {
  fdcId: number;
  name: string;
  brand: string | null;
  /** Energy per 100 g; null when the food database has no value. */
  caloriesPer100g: number | null;
}

export interface EntryPayload {
  name: string;
  calories: number;
  consumedAt?: string;
  fdcId?: number;
  brand?: string;
  quantityGrams?: number;
}

/** `null` clears an optional detail. */
export interface EntryUpdatePayload {
  name?: string;
  calories?: number;
  consumedAt?: string;
  fdcId?: number | null;
  brand?: string | null;
  quantityGrams?: number | null;
}

export interface EntriesQuery {
  dateFrom?: string;
  dateTo?: string;
  timezone?: string;
  page?: number;
  limit?: number;
}