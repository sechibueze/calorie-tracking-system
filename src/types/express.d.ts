import { AuthContext } from "@/schema/auth.schema";

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      auth?: AuthContext
    }
  }
}

export {};