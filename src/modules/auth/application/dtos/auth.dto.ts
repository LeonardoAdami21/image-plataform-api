export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: { id: string; email: string; name: string };
}
