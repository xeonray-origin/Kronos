import { PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from '../slice/auth.slice';

export default {
  setToken(state: IAuthState, action: PayloadAction<string>) {
    return { ...state, token: action.payload };
  },
  clearToken(state: IAuthState) {
    return { ...state, token: '', isLoggedIn: false, status: 'idle' as const, user: {} };
  },
};
