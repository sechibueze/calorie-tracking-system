
import type { User } from '@/database/generated/prisma/client';

export interface AuthContext {
  user: User;
  role: string;
  permissions: string[];
  tokenId: string;
}