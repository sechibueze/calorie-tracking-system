import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validate.middleware';
import { loginSchema } from '@/schema/auth.schema';

export const authRouter = Router();

authRouter.get('/me', authenticate, authController.getCurrentUser);
authRouter.post('/', validateRequest(loginSchema),  authController.login);