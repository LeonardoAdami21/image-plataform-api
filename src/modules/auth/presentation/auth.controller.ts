import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../application/use-cases/register-user.usecase';
import { AuthenticateUserUseCase } from '../application/use-cases/authenticate-user.usecase';
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
} from '../application/errors/auth.errors';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly authenticateUser: AuthenticateUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário e retorna um JWT' })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUser.execute(dto);
    } catch (err) {
      if (err instanceof EmailAlreadyInUseError) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica um usuário e retorna um JWT' })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authenticateUser.execute(dto);
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(err.message);
      }
      throw err;
    }
  }
}
