import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      return { ...state, token: action.payload };
    },
    clearToken(state) {
      return { ...state, token: '', isLoggedIn: false, status: 'idle', user: {} };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
