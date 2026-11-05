import { Router } from 'express';
import { PERMISSIONS } from '@/config/rbac.config';
import { authenticate } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/authorize.middleware';
import * as userController from '@/controllers/user.controller'
export const userRouter = Router();

userRouter.get('/', authenticate, requirePermission(PERMISSIONS.USERS_READ), userController.list);