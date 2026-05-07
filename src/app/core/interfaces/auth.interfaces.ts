export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IAuthStorage {
  token: string;
  user: ILoginRequest;
}
