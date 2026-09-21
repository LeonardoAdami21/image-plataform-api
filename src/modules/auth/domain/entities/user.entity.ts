import { Email } from '../value-objects/email.vo';

interface UserProps {
  id: string;
  email: Email;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

/** Agregado raiz de Usuário. Regras de negócio ficam aqui. */
export class User {
  private constructor(private props: UserProps) {}

  static create(props: {
    id: string;
    email: Email;
    name: string;
    passwordHash: string;
    createdAt?: Date;
  }): User {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Nome deve ter ao menos 2 caracteres.');
    }
    return new User({
      id: props.id,
      email: props.email,
      name: props.name.trim(),
      passwordHash: props.passwordHash,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get name() {
    return this.props.name;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
