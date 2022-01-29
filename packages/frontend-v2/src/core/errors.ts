export class CoreError implements Error {
  public name = '';
  public message: string;

  constructor(protected description: string) {
    this.message = description;
  }

  public getErrorType(): string {
    return 'CoreError';
  }

  toString() {
    return `${this.getErrorType()}: ${this.description}`;
  }
}

export class ApiError extends CoreError {
  static readonly status: number = 0;

  constructor(protected httpStatus: number, protected description: string, public code?: string) {
    super(`${httpStatus} ${description}`);
  }

  getErrorType(): string {
    return 'ApiError';
  }
}

export const ApiErrors = {
  NetworkError: class NetworkError extends ApiError {
    constructor(description: string, code?: string) {
      super(0, `NetworkError: ${description}`, code);
    }
  },

  Unauthorized: class Unauthorized extends ApiError {
    static readonly status = 401;

    constructor(description: string, code?: string) {
      super(Unauthorized.status, description, code);
    }
  },

  Forbidden: class Forbidden extends ApiError {
    static readonly status = 403;

    constructor(description: string, code?: string) {
      super(Forbidden.status, description, code);
    }
  },

  NotFound: class NotFound extends ApiError {
    static readonly status = 404;

    constructor(description: string, code?: string) {
      super(NotFound.status, description, code);
    }
  },

  InvalidRequest: class InvalidRequest extends ApiError {
    static readonly status = 400;

    constructor(description: string, code?: string) {
      super(InvalidRequest.status, description, code);
    }
  },

  Expired: class Expired extends ApiError {
    static readonly status = 410;

    constructor(description: string, code?: string) {
      super(Expired.status, description, code);
    }
  },

  ConflictError: class ConflictError extends ApiError {
    static readonly status = 409;

    constructor(description: string, code?: string) {
      super(ConflictError.status, description, code);
    }
  },

  ServerError: class ServerError extends ApiError {
    static readonly status = 500;

    constructor(description: string, code?: string) {
      super(ServerError.status, description, code);
    }
  },

  ServiceUnavailableError: class ServiceUnavailableError extends ApiError {
    static readonly status = 503;

    constructor(description: string, code?: string) {
      super(ServiceUnavailableError.status, description, code);
    }
  },
};
