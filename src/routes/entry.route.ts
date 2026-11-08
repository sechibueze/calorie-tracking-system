import { Router } from 'express';
import { PERMISSIONS } from '@/config/rbac.config';
import { authenticate } from '@/middleware/auth.middleware';
import * as entryController from '@/controllers/entry.controller';
import {
  createEntryBody,
  entryIdParams,
  listEntriesQuery,
  suggestQuery,
  summaryQuery,
  updateEntryBody,
} from '@/schema/entry.schema';
import { requirePermission } from '@/middleware/authorize.middleware';
import { validateRequest } from '@/middleware/validate.middleware';

export const entryRouter = Router();

const canRead = requirePermission(PERMISSIONS.ENTRIES_READ_OWN);
const canWrite = requirePermission(PERMISSIONS.ENTRIES_WRITE_OWN);

entryRouter.use(authenticate);


entryRouter.get(
  '/suggest',
  requirePermission(PERMISSIONS.AUTOCOMPLETE_READ),
  validateRequest(suggestQuery, 'query'),
  entryController.suggest,
);

entryRouter.get('/', canRead, validateRequest(listEntriesQuery, 'query'), entryController.list);

// Declared before '/:id' so "summary" is not treated as an id.
entryRouter.get('/summary', canRead, validateRequest(summaryQuery, 'query'), entryController.summary);
entryRouter.post('/', canWrite, validateRequest(createEntryBody), entryController.create);
entryRouter.get('/:id', canRead, validateRequest(entryIdParams, 'params'), entryController.get);
entryRouter.patch(
  '/:id',
  canWrite,
  validateRequest(entryIdParams, 'params'),
  validateRequest(updateEntryBody),
  entryController.update,
);
entryRouter.delete('/:id', canWrite, validateRequest(entryIdParams, 'params'), entryController.remove);