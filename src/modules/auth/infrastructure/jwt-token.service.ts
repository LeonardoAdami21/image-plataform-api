import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenGenerator,
  TokenPayload,
} from '../application/ports/token-generator.port';

@Injectable()
export class JwtTokenService implements TokenGenerator {
  constructor(private readonly jwt: JwtService) {}
  sign(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}
