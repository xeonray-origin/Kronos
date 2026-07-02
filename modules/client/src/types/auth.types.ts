export interface IAuthPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  token: string;
  maxCookieAge: number;
}

export interface IRefreshResponse {
  token: string;
}
