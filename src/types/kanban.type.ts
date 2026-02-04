// Tipos de erro para o Kanban
export interface KanbanError {
  message: string;
  code?: string;
  field?: string;
  details?: unknown;
}

export class KanbanApiError extends Error {
  public code?: string;
  public field?: string;
  public details?: unknown;

  constructor(
    message: string,
    code?: string,
    field?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'KanbanApiError';
    this.code = code;
    this.field = field;
    this.details = details;
  }
}

// Tipos de erro específicos
export enum KanbanErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// Helper para criar erros tipados
export function createKanbanError(
  message: string,
  code: KanbanErrorCode = KanbanErrorCode.INTERNAL_ERROR,
  field?: string,
  details?: unknown
): KanbanApiError {
  return new KanbanApiError(message, code, field, details);
}
