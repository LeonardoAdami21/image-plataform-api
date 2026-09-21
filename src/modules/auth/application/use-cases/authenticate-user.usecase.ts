import { Inject, Injectable } from '@nestjs/common';
import { Email } from '../../domain/value-objects/email.vo';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher.port';
import { TOKEN_GENERATOR, TokenGenerator } from '../ports/token-generator.port';
import { AuthResult, AuthenticateUserInput } from '../dtos/auth.dto';
import { InvalidCredentialsError } from '../errors/auth.errors';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthResult> {
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch {
      throw new InvalidCredentialsError();
    }

    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const ok = await this.hasher.compare(input.password, user.passwordHash);
    if (!ok) throw new InvalidCredentialsError();

    const accessToken = await this.tokens.sign({
      sub: user.id,
      email: user.email.value,
      name: user.name,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email.value, name: user.name },
    };
  }
}
