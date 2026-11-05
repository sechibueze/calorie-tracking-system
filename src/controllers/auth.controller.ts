import type { Request, Response } from 'express';
import * as authService from '@/services/auth.service'
import { sendSuccess } from '@/utils/http-response.util';
export function getCurrentUser(req: Request, res: Response) {
  return sendSuccess(res, authService.describeCaller(req.auth!))
}