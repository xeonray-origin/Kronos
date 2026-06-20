import { render, screen } from '@testing-library/react';
import App from '@/App';

jest.mock('@/pages', () => ({
  AppLayout: () => <div data-testid="app-layout" />,
}));

describe('App', () => {
  it('renders AppLayout', () => {
    render(<App />);
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
  });
});
