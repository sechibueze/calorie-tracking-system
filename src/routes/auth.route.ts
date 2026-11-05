import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth.middleware';

export const authRouter = Router();

authRouter.get('/me', authenticate, authController.getCurrentUser);