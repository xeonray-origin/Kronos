import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ProtectedRoute } from '@/components/session';
import { store, authActions } from '@/store';

jest.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}));

const renderRoute = () =>
  render(
    <Provider store={store}>
      <ProtectedRoute />
    </Provider>,
  );

describe('ProtectedRoute', () => {
  beforeEach(() => store.dispatch(authActions.clearToken()));

  it('renders the outlet when logged in', () => {
    store.dispatch(authActions.setToken('t'));
    renderRoute();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to the login page when logged out', () => {
    renderRoute();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
  });
});
