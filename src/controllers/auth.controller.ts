import type { Request, Response } from 'express';

export function getCurrentUser(req: Request, res: Response) {
  const auth = req.auth!;
  return res.status(200).json( {
    id: auth.user.id,
    email: auth.user.email,
    name: auth.user.name,
    dailyCalorieLimit: auth.user.dailyCalorieLimit,
    role: auth.role,
    permissions: [...auth.permissions].sort(),
  })
}