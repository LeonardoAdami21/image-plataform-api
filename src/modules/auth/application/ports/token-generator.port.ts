export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
}

export interface TokenGenerator {
  sign(payload: TokenPayload): Promise<string>;
}
