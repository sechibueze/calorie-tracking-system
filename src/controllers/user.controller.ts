import { listUsers } from '@/repositories/user.repository';
import { createNewUser } from '@/services/user.service';
import { sendSuccess } from '@/utils/http-response.util';
import type { NextFunction, Request, Response } from 'express';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await createNewUser(req.body);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        
        const users = await listUsers();
        sendSuccess(
          res,
          users.map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role.name,
            dailyCalorieLimit: u.dailyCalorieLimit,
            createdAt: u.createdAt,
          })),
        );
    } catch (error) {
       next(error) 
    }
}