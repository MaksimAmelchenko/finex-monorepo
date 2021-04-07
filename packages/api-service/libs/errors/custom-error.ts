import { STATUS_CODES } from 'http';
import { IError } from '../../types/app';
import * as isObject from 'lodash.isobject';
import * as isEmpty from 'lodash.isempty';

export class CustomError extends Error implements IError {
  code: string;
  status: number;
  data: Record<string, unknown> | undefined;

  constructor(
    errorStatus: number,
    errorCode: string,
    messageOrParams: string | Record<string, unknown> = STATUS_CODES[errorStatus]!,
    params: Record<string, unknown> = {}
  ) {
    let message: string;
    let errorParams: any;
    if (isObject(messageOrParams)) {
      message = STATUS_CODES[errorStatus]!;
      errorParams = <Record<string, unknown>>messageOrParams;
    } else {
      message = <string>messageOrParams;
      errorParams = params;
    }
    super(message);
    const { status = errorStatus, code = errorCode, ...data } = errorParams;
    this.code = code;
    this.status = status;
    if (!isEmpty(data)) {
      this.data = data;
    }
  }
}
