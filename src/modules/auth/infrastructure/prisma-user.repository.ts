import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { User } from '../domain/entities/user.entity';
import { Email } from '../domain/value-objects/email.vo';
import { UserRepository } from '../domain/repositories/user.repository';

interface UserRow {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { email: email.value },
    });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email.value,
        name: user.name,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
      update: {
        email: user.email.value,
        name: user.name,
        passwordHash: user.passwordHash,
      },
    });
  }

  private toDomain(row: UserRow): User {
    return User.create({
      id: row.id,
      email: Email.create(row.email),
      name: row.name,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    });
  }
}
