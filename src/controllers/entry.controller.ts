import type { Request, Response } from 'express';
import { sendSuccess } from '@/utils/http-response.util';
import type { CreateEntryBody, ListEntriesQuery, SummaryQuery, UpdateEntryBody } from '@/schema/entry.schema';
import * as entryService from '@/services/entry.service';


export async function create(req: Request, res: Response): Promise<void> {
  const entry = await entryService.createEntry(req.auth!, req.body as CreateEntryBody);
  sendSuccess(res, entry, { status: 201 });
}

export async function list(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as  ListEntriesQuery;
  const { items, meta } = await entryService.listEntries(req.auth!, query);
  sendSuccess(res, items, { meta });
}

export async function summary(req: Request, res: Response): Promise<void> {
  const summaryQuery = req.query as unknown as ListEntriesQuery;
  sendSuccess(res, await entryService.getDailySummary(req.auth!, summaryQuery));
}

export async function get(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await entryService.getEntry(req.auth!, req.params.id as string);
}

export async function update(req: Request, res: Response): Promise<void> {
  const entry = await entryService.updateEntry(req.auth!, req.params.id as string, req.body);
  sendSuccess(res, entry);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await entryService.deleteEntry(req.auth!, req.params.id as string);
  res.status(204).send();
}