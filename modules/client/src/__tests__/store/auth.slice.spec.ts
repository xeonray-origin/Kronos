import { authSlice, IAuthState } from '@/store/slice/auth.slice';

const reducer = authSlice.reducer;
const { setToken, clearToken } = authSlice.actions;

const initialState: IAuthState = {
  isLoggedIn: false,
  token: '',
  status: 'idle',
  user: {},
  error: null,
};

describe('auth slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setToken stores the token and marks the session logged in', () => {
    const state = reducer(
      { ...initialState, status: 'failed', error: 'old error' },
      setToken('abc.def.ghi'),
    );
    expect(state).toEqual({
      isLoggedIn: true,
      token: 'abc.def.ghi',
      status: 'failed',
      user: {},
      error: 'old error',
    });
  });

  it('clearToken resets token, login flag, status and user', () => {
    const state = reducer(
      { isLoggedIn: true, token: 'tok', status: 'failed', user: { id: 1 }, error: 'err' },
      clearToken(),
    );
    expect(state).toEqual({
      isLoggedIn: false,
      token: '',
      status: 'idle',
      user: {},
      error: 'err',
    });
  });
});
