import { configureStore } from '@reduxjs/toolkit';
import authReducer, { clearToken, IAuthState, setToken } from '@/store/auth.slice';

function makeStore(preloaded?: Partial<IAuthState>) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloaded ? { auth: preloaded as IAuthState } : undefined,
  });
}

describe('auth slice', () => {
  describe('initial state', () => {
    it('has the correct shape', () => {
      const store = makeStore();
      expect(store.getState().auth).toEqual({
        isLoggedIn: false,
        token: '',
        status: 'idle',
        error: null,
      });
    });
  });

  describe('setToken', () => {
    it('sets token, marks as logged in, and clears status and error', () => {
      const store = makeStore({
        isLoggedIn: false,
        token: '',
        status: 'failed',
        error: 'old error',
      });
      store.dispatch(setToken('abc.def.ghi'));
      expect(store.getState().auth).toEqual({
        isLoggedIn: true,
        token: 'abc.def.ghi',
        status: 'idle',
        error: null,
      });
    });
  });

  describe('clearToken', () => {
    it('clears token, marks as logged out, and resets status and error', () => {
      const store = makeStore({ isLoggedIn: true, token: 'tok', status: 'failed', error: 'err' });
      store.dispatch(clearToken());
      expect(store.getState().auth).toEqual({
        isLoggedIn: false,
        token: '',
        status: 'idle',
        error: null,
      });
    });
  });
});
