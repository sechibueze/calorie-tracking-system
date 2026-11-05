import { listUsers } from '@/repositories/user.repository';
import { sendSuccess } from '@/utils/http-response.util';
import type { Request, Response } from 'express';

export async function list(_req: Request, res: Response): Promise<void> {
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
}