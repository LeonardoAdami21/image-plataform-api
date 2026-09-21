/** Value Object de e-mail: uma vez construído, é garantidamente válido. */
export class Email {
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {}

  static create(raw: string): Email {
    const normalized = (raw ?? '').trim().toLowerCase();
    if (!Email.PATTERN.test(normalized)) {
      throw new Error(`E-mail inválido: "${raw}"`);
    }
    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
