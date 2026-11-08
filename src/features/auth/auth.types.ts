
export interface Role{
  name: string
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
  dailyCalorieLimit: number;
}

export interface Session {
  token: string;
  user: AuthUser;
}