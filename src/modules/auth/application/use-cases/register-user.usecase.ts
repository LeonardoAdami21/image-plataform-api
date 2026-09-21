import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher.port';
import { ID_GENERATOR, IdGenerator } from '../ports/id-generator.port';
import { TOKEN_GENERATOR, TokenGenerator } from '../ports/token-generator.port';
import { AuthResult, RegisterUserInput } from '../dtos/auth.dto';
import { EmailAlreadyInUseError } from '../errors/auth.errors';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(TOKEN_GENERATOR) private readonly tokens: TokenGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResult> {
    const email = Email.create(input.email);
    if (await this.users.findByEmail(email)) {
      throw new EmailAlreadyInUseError(email.value);
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({
      id: this.ids.generate(),
      email,
      name: input.name,
      passwordHash,
    });
    await this.users.save(user);

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
