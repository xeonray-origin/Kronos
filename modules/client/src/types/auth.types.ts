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

export interface IRegisterPayload {
  name: { firstName: string; lastName: string };
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: string;
}

export interface IRegisterResponse {
  _id: string;
  name: { firstName: string; lastName: string };
  email: string;
  phoneNumber: string;
  role: string;
}
