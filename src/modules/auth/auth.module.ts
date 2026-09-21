import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user.usecase';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_GENERATOR } from './application/ports/token-generator.port';
import { ID_GENERATOR } from './application/ports/id-generator.port';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { BcryptHasher } from './infrastructure/bcrypt.hasher';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import { UuidGenerator } from './infrastructure/uuid.generator';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptHasher },
    { provide: TOKEN_GENERATOR, useClass: JwtTokenService },
    { provide: ID_GENERATOR, useClass: UuidGenerator },
  ],
})
export class AuthModule {}
