export class ProjectNotFoundError extends Error {
  constructor(id: string) {
    super(`Projeto ${id} não encontrado.`);
    this.name = 'ProjectNotFoundError';
  }
}

export class ForbiddenProjectAccessError extends Error {
  constructor() {
    super('Você não tem acesso a este projeto.');
    this.name = 'ForbiddenProjectAccessError';
  }
}
