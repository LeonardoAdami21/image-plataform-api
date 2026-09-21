import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Valida o header Authorization: Bearer <jwt> e injeta o usuário em req.user.
 * Aplicado com @UseGuards(JwtAuthGuard) nos controllers protegidos.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.secret = config.get<string>('JWT_SECRET', 'super-secret-change-me');
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente.');
    }
    try {
      const payload = this.jwt.verify<{
        sub: string;
        email: string;
        name: string;
      }>(header.slice(7), { secret: this.secret });
      (req as Request & { user: AuthenticatedUser }).user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
