import { createSlice } from '@reduxjs/toolkit';
import type { IAuthState } from '@/types';
import { authReducer } from '../reducer';

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
