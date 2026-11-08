
import type { User } from '@/database/generated/prisma/client';
import {z} from 'zod';

export interface AuthContext {
  user: User;
  role: string;
  permissions: string[];
  tokenId: string;
}



export const createUserSchema = z.object({
  email: z
    .email()
    .transform((value: string) => value.toLowerCase()),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  password: z
    .string()
    .min(8)
    .max(128),

  dailyCalorieLimit: z
    .number()
    .int()
    .positive()
    .max(10000)
    .optional(),
});


export const loginSchema = z.object({
  email: z
    .email()
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1)
    .max(128),

  deviceName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),
  role: z
    .string()
    .optional(),
});

export type LoginInput = z.infer<
  typeof loginSchema
>;

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;
