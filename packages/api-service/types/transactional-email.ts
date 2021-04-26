export enum Template {
  SignUpConfirmation = 'sign-up-confirmation',
  PasswordReset = 'password-reset',
  Export = 'export',
}

export interface IAttachment {
  filename: string;
  content: string | Buffer;
}

export interface ISendParams {
  template: string;
  email: string;
  locals: Record<string, unknown>;
  attachments?: IAttachment[];
}
