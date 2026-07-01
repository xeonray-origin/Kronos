import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PublicRoute } from '@/components/session';
import { store, authActions } from '@/store';

jest.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}));

const renderRoute = () =>
  render(
    <Provider store={store}>
      <PublicRoute />
    </Provider>,
  );

describe('PublicRoute', () => {
  beforeEach(() => store.dispatch(authActions.clearToken()));

  it('renders the outlet when logged out', () => {
    renderRoute();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to the dashboard when logged in', () => {
    store.dispatch(authActions.setToken('t'));
    renderRoute();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });
});
