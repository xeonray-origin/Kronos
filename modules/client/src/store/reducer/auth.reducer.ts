import { PayloadAction } from '@reduxjs/toolkit';
import type { IAuthState } from '@/types';

export default {
  setToken(state: IAuthState, action: PayloadAction<string>) {
    return { ...state, token: action.payload, isLoggedIn: true };
  },
  clearToken(state: IAuthState) {
    return { ...state, token: '', isLoggedIn: false, status: 'idle' as const, user: {} };
  },
};
