import { render, screen } from '@testing-library/react';
import { Bell } from 'lucide-react';
import { Sidebar } from '@/components';

describe('Sidebar', () => {
  it('renders default user, links, and projects', () => {
    render(<Sidebar />);

    expect(screen.getByText('Xeonray')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Analyze')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('🍎')).toBeInTheDocument();
    expect(screen.getByText('Blog topics')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument();
  });

  it('renders provided user, links, and projects', () => {
    render(
      <Sidebar
        user={{ name: 'Ada', avatarUrl: 'https://example.com/ada.png' }}
        links={[{ icon: Bell, label: 'Alerts', active: true }]}
        projects={[{ name: 'Solo Project' }]}
      />,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Solo Project')).toBeInTheDocument();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
    expect(screen.queryByText('Grocery List')).not.toBeInTheDocument();
  });
});
