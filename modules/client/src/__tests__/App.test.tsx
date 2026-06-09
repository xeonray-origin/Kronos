import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  it('renders the Kronos heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /kronos/i })).toBeInTheDocument();
  });
});
