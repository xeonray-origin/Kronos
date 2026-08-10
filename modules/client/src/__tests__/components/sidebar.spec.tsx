import { render, screen, fireEvent } from '@testing-library/react';
import { Bell } from 'lucide-react';
import { Sidebar } from '@/components';

describe('Sidebar', () => {
  it('renders default user and links with no labels', () => {
    render(<Sidebar />);

    expect(screen.getByText('Xeonray')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Analyze')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument();
  });

  it('renders provided user, links, and labels, highlighting the active one', () => {
    const onSelectLabel = jest.fn();
    render(
      <Sidebar
        user={{ name: 'Ada', avatarUrl: 'https://example.com/ada.png' }}
        links={[{ icon: Bell, label: 'Alerts', active: true }]}
        labels={[
          { label: 'frontend', count: 3 },
          { label: 'auth', count: 1 },
        ]}
        activeLabel="frontend"
        onSelectLabel={onSelectLabel}
      />,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();

    expect(screen.getByText('frontend').closest('button')!.className).toMatch(/text-brand/);
    expect(screen.getByText('auth').closest('button')!.className).not.toMatch(/text-brand/);
    expect(screen.getByText('3')).toBeInTheDocument();

    fireEvent.click(screen.getByText('auth'));
    expect(onSelectLabel).toHaveBeenCalledWith('auth');
  });

  it('does not throw when a label is clicked without an onSelectLabel handler', () => {
    render(<Sidebar labels={[{ label: 'frontend', count: 1 }]} />);

    fireEvent.click(screen.getByText('frontend'));
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });
});
