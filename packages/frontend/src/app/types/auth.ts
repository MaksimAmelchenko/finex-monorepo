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
