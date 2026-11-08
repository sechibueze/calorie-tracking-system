import type { NextFunction, Request, Response } from 'express';
import * as authService from '@/services/auth.service'
import { sendSuccess } from '@/utils/http-response.util';
export function getCurrentUser(req: Request, res: Response) {
  return sendSuccess(res, authService.describeCaller(req.auth!))
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
     try {
      const data = await authService.loginUser(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data,
      });
    } catch (error) {
      next(error);
    }
}

