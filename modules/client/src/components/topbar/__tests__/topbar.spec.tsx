import { render, screen, fireEvent } from '@testing-library/react';

import { Topbar } from '../topbar';

describe('Topbar', () => {
  describe('rendering', () => {
    it('renders with default app name', () => {
      render(<Topbar />);

      expect(screen.getByText('Tempo')).toBeInTheDocument();
    });

    it('renders with custom app name', () => {
      render(<Topbar appName="MyApp" />);

      expect(screen.getByText('MyApp')).toBeInTheDocument();
    });

    it('renders input with default placeholder', () => {
      render(<Topbar />);

      expect(screen.getByPlaceholderText('Add a task...')).toBeInTheDocument();
    });

    it('renders input with custom placeholder', () => {
      render(<Topbar placeholder="Create a new item" />);

      expect(screen.getByPlaceholderText('Create a new item')).toBeInTheDocument();
    });

    it('renders board and list view buttons', () => {
      render(<Topbar />);

      expect(screen.getByLabelText('Board view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('renders refresh button', () => {
      render(<Topbar />);

      expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
    });

    it('displays first character of app name in icon badge', () => {
      render(<Topbar appName="Tasks" />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onAddTask when input is clicked', () => {
      const onAddTask = jest.fn();

      render(<Topbar onAddTask={onAddTask} />);

      fireEvent.click(screen.getByPlaceholderText('Add a task...'));

      expect(onAddTask).toHaveBeenCalledTimes(1);
    });

    it('calls onViewChange with "board" when board button is clicked', () => {
      const onViewChange = jest.fn();

      render(<Topbar onViewChange={onViewChange} />);

      fireEvent.click(screen.getByLabelText('Board view'));

      expect(onViewChange).toHaveBeenCalledWith('board');
    });

    it('calls onViewChange with "list" when list button is clicked', () => {
      const onViewChange = jest.fn();

      render(<Topbar onViewChange={onViewChange} />);

      fireEvent.click(screen.getByLabelText('List view'));

      expect(onViewChange).toHaveBeenCalledWith('list');
    });

    it('calls onRefresh when refresh button is clicked', () => {
      const onRefresh = jest.fn();

      render(<Topbar onRefresh={onRefresh} />);

      fireEvent.click(screen.getByLabelText('Refresh'));

      expect(onRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('view state', () => {
    it('applies active styling to board button when currentView is board', () => {
      render(<Topbar currentView="board" />);

      const boardButton = screen.getByLabelText('Board view');
      expect(boardButton).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    it('applies active styling to list button when currentView is list', () => {
      render(<Topbar currentView="list" />);

      const listButton = screen.getByLabelText('List view');
      expect(listButton).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    it('does not apply active styling to board button when currentView is list', () => {
      render(<Topbar currentView="list" />);

      const boardButton = screen.getByLabelText('Board view');
      expect(boardButton).not.toHaveClass('bg-accent', 'text-accent-foreground');
    });
  });

  describe('accessibility', () => {
    it('has proper aria-label on board view button', () => {
      render(<Topbar />);

      expect(screen.getByLabelText('Board view')).toBeInTheDocument();
    });

    it('has proper aria-label on list view button', () => {
      render(<Topbar />);

      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('has proper aria-label on refresh button', () => {
      render(<Topbar />);

      expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
    });
  });
});
