import { CoreError } from './errors';

/**
 * Represents Loading state from API.
 *
 */
export class LoadState {
  static none(): NoneState {
    return noneState;
  }

  static pending(): PendingState {
    return pendingState;
  }

  static done(): DoneState {
    return doneState;
  }

  static error(error: CoreError): ErrorState {
    return new ErrorState(error);
  }

  isNone(): this is NoneState {
    return this instanceof NoneState;
  }

  isPending(): this is PendingState {
    return this instanceof PendingState;
  }

  isDone(): this is DoneState {
    return this instanceof DoneState;
  }

  isError(): this is ErrorState {
    return this instanceof ErrorState;
  }

  isNoneOrPending(): boolean {
    return this instanceof PendingState || this instanceof NoneState;
  }
}

/**
 * Nothing has been doneState with the model, it wasn't been loaded, so you cannot use it
 */
export class NoneState extends LoadState {}

/**
 * Model or list is being loaded from backend
 */
export class PendingState extends LoadState {}

/**
 * Model or List has been loaded and ready to use
 */
export class DoneState extends LoadState {}

/**
 * Error happened when it was been loaded
 */
export class ErrorState extends LoadState {
  constructor(protected error: CoreError) {
    super();
  }

  getError(): CoreError {
    return this.error;
  }
}

const noneState = new NoneState();
const pendingState = new PendingState();
const doneState = new DoneState();
