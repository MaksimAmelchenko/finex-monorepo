export enum Template {
  SignUpConfirmation = 'sign-up-confirmation',
  PasswordReset = 'password-reset',
}

export interface IAttachment {
  filename: string;
  content: string;
}

export interface ISendParams {
  template: string;
  email: string;
  locals: Record<string, unknown>;
  attachments?: IAttachment[];
}
