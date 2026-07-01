import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { SessionGuard } from '@/components/session';
import { store, authActions } from '@/store';
import { authApi } from '@/api';

jest.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

jest.mock('@/api', () => ({
  authApi: { refreshSession: jest.fn() },
}));

const mockRefresh = authApi.refreshSession as jest.Mock;

const renderGuard = () =>
  render(
    <Provider store={store}>
      <SessionGuard />
    </Provider>,
  );

describe('SessionGuard', () => {
  beforeEach(() => {
    store.dispatch(authActions.clearToken());
    mockRefresh.mockReset();
  });

  it('renders the outlet without refreshing when a token already exists', () => {
    store.dispatch(authActions.setToken('existing'));
    renderGuard();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('shows loading then renders the outlet after a successful refresh', async () => {
    mockRefresh.mockResolvedValue({ token: 'fresh' });
    renderGuard();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('outlet')).toBeInTheDocument());
    expect(store.getState().auth.token).toBe('fresh');
  });

  it('renders the outlet after a failed refresh', async () => {
    mockRefresh.mockRejectedValue(new Error('no session'));
    renderGuard();
    await waitFor(() => expect(screen.getByTestId('outlet')).toBeInTheDocument());
    expect(store.getState().auth.isLoggedIn).toBe(false);
  });
});
