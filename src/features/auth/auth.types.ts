export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  dailyCalorieLimit: number;
}

export interface Session {
  token: string;
  user: AuthUser;
}