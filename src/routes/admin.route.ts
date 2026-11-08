import { Router } from 'express';
import { PERMISSIONS } from '@/config/rbac.config';
import { entryIdParams, updateEntryBody } from '@/schema/entry.schema';
import * as controller from '@/controllers/admin.controller';
import { adminCreateEntryBody, adminListEntriesQuery } from '@/schema/admin.schema';
import { requirePermission } from '@/middleware/authorize.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validate.middleware';

export const adminRouter = Router();

const canRead = requirePermission(PERMISSIONS.ENTRIES_READ_ALL);
const canWrite = requirePermission(PERMISSIONS.ENTRIES_WRITE_ALL);

adminRouter.use(authenticate);

adminRouter.get('/entries', canRead, validateRequest(adminListEntriesQuery, 'query'), controller.listEntries);
adminRouter.post('/entries', canWrite, validateRequest(adminCreateEntryBody), controller.createEntry);
adminRouter.get('/entries/:id', canRead, validateRequest(entryIdParams, 'params'), controller.getEntry);
adminRouter.patch(
  '/entries/:id',
  canWrite,
  validateRequest(entryIdParams, 'params'),
  validateRequest(updateEntryBody),
  controller.updateEntry,
);
adminRouter.delete('/entries/:id', canWrite, validateRequest(entryIdParams, 'params'), controller.deleteEntry);

adminRouter.get('/reports/summary', requirePermission(PERMISSIONS.REPORTS_READ), controller.weeklyReport);