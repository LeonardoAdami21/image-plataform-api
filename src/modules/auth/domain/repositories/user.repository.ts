import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

/** Porta de saída do domínio; implementada pela infraestrutura (Prisma). */
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
