import type { CreateUserInput } from "@/schema/auth.schema";
import * as userRepository from '@/repositories/user.repository'
import { ConflictError } from "@/utils/http-error.util";
import { hashPassword } from "@/utils/hash.util";

export const createNewUser = async (
  input: CreateUserInput,
) => {
  const existingUser = await userRepository.getUserByEmail(input.email)

  if (existingUser) {
    throw new ConflictError('Email is already registered.', 409);
  }

  const hashedPassword = await hashPassword(input.password);

  try {
    const role = await userRepository.getUserRole(input.role || 'USER')
    return await userRepository.createUser({
        ...input,
        password: hashedPassword,
        roleId: role?.id as string
    });
  } catch (error) {
    throw error;
  }
};
