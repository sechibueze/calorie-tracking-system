import type { FoodEntry } from '@/database/generated/prisma/client';
import { dayRangeToUtc } from '@/utils/date.util';
import * as entryRepository from '@/repositories/entry.repository';
import type { UpdateEntryBody } from '@/schema/entry.schema';
import { toEntryDto } from '@/services/entry.service';
import { getUserById, getUsersByIds } from '@/repositories/user.repository';
import type { AdminCreateEntryBody, AdminListEntriesQuery } from '@/schema/admin.schema';
import { NotFoundError } from '@/utils/http-error.util';

interface Owner {
  id: string;
  email: string;
  name: string;
}

const toAdminDto = (entry: FoodEntry, owner: Owner | undefined) => ({
  ...toEntryDto(entry),
  userId: entry.userId,
  user: owner ?? null,
});

const entryNotFound = () => new NotFoundError('Food entry not found');

async function ownerOf(userId: string): Promise<Owner | undefined> {
  return (await getUsersByIds([userId]))[0];
}

export async function listEntries(query: AdminListEntriesQuery) {
  const { items, total } = await entryRepository.listEntries({
    userId: query.userId,
    range: dayRangeToUtc(query.dateFrom, query.dateTo, query.timezone),
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });
  const owners = new Map(
    (await getUsersByIds([...new Set(items.map((e) => e.userId))])).map((u) => [u.id, u]),
  );
  return {
    items: items.map((e) => toAdminDto(e, owners.get(e.userId))),
    meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
}

export async function getEntry(id: string) {
  const entry = await entryRepository.findEntry(id);
  if (!entry) throw entryNotFound();
  return toAdminDto(entry, await ownerOf(entry.userId));
}

export async function createEntry(input: AdminCreateEntryBody) {
  const { userId, ...fields } = input;
  const owner = await getUserById(userId);
  if (!owner) throw new NotFoundError('User not found');

  const entry = await entryRepository.createEntry({ userId, ...fields, consumedAt: fields.consumedAt ?? new Date() });
  return toAdminDto(entry, { id: owner.id, email: owner.email, name: owner.name });
}

export async function updateEntry(id: string, input: UpdateEntryBody) {
  const entry = await entryRepository.updateEntry(id, input);
  if (!entry) throw entryNotFound();
  return toAdminDto(entry, await ownerOf(entry.userId));
}

export async function deleteEntry(id: string): Promise<void> {
  if (!(await entryRepository.softDeleteEntry(id))) throw entryNotFound();
}