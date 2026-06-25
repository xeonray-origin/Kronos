import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  isLoggedIn: boolean;
  token: string;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  token: '',
  status: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.status = 'idle';
      state.error = null;
    },
    clearToken(state) {
      state.token = '';
      state.isLoggedIn = false;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
