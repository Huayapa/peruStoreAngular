export interface IAuthRequest {
  username: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  id: number;
}

export interface IAuthStorage {
  token: string;
}
