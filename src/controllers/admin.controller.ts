import type { NextFunction, Request, Response } from 'express';
import type { UpdateEntryBody } from '@/schema/entry.schema';
import * as adminEntryService from '@/services/admin-entry.service';
import type { AdminCreateEntryBody, AdminListEntriesQuery } from '@/schema/admin.schema';
import * as reportService from '@/services/report.service';


export async function listEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, meta } = await adminEntryService.listEntries(req.query as unknown as AdminListEntriesQuery);
    res.status(200).json({ success: true, data: items, meta });
  } catch (err) {
    next(err);
  }
}

export async function getEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({ success: true, data: await adminEntryService.getEntry(req.params.id as string) });
  } catch (err) {
    next(err);
  }
}

export async function createEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entry = await adminEntryService.createEntry(req.body as AdminCreateEntryBody);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function updateEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entry = await adminEntryService.updateEntry(req.params.id as string, req.body as UpdateEntryBody);
    res.status(200).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function deleteEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await adminEntryService.deleteEntry(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function weeklyReport(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({ success: true, data: await reportService.getWeeklyReport() });
  } catch (err) {
    next(err);
  }
}