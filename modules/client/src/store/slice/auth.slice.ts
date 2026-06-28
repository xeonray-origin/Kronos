import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authReducer } from '../reducer';

export interface IAuthState {
  isLoggedIn: boolean;
  token: string;
  user: {};
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  token: '',
  status: 'idle',
  user: {},
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: authReducer,
});

export default authSlice;
