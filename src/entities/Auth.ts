export enum AuthUserActionType {
  LOGIN_USER = "AUTH_LOGIN_USER",
  LOGOUT_USER = "AUTH_LOGOUT_USER",
}

export interface IUser {
  email: string;
  name: string;
}

export interface IAuthUser {
  isAuth: boolean;
  user?: IUser;
}

export interface IRegister {
  image: File | null;
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResult {
  access_token: string;
}
