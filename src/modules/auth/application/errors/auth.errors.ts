export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O e-mail ${email} já está em uso.`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciais inválidas.');
    this.name = 'InvalidCredentialsError';
  }
}
