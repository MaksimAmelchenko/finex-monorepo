export interface ISessionResponse {
  authorization: string;
  idUser: string;
  idProject: string;
}

export interface ISignUpRequestResponse {
  signUpRequest: {
    id: string;
  };
}

export interface IResetPasswordRequestResponse {
  resetPasswordRequest: {
    id: string;
  };
}

export type ChangePasswordParams = {
  password: string;
  newPassword: string;
};
