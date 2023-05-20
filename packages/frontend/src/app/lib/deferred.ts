export class Deferred<T> {
  private readonly _promise: Promise<T>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private _resolve: (value: T | PromiseLike<T>) => void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private _reject: (reason?: any) => void;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value: T | PromiseLike<T>) {
    this._resolve(value);
  }

  reject(reason: any) {
    this._reject(reason);
  }

  get promise() {
    return this._promise;
  }
}
