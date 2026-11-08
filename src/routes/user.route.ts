import { Router } from 'express';
import { PERMISSIONS } from '@/config/rbac.config';
import { authenticate } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/authorize.middleware';
import * as userController from '@/controllers/user.controller'
import { validateRequest } from '@/middleware/validate.middleware';
import { createUserSchema } from '@/schema/auth.schema';
export const userRouter = Router();

userRouter.get('/', 
    // authenticate, requirePermission(PERMISSIONS.USERS_READ), 
    userController.list);
userRouter.post('/', validateRequest(createUserSchema), userController.register);