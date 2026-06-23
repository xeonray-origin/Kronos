import { render, screen, fireEvent } from '@testing-library/react';

import { Topbar } from '../topbar';

describe('Topbar', () => {
  const onToggleTheme = jest.fn();

  beforeEach(() => {
    onToggleTheme.mockClear();
  });

  describe('rendering', () => {
    it('renders with default app name', () => {
      render(<Topbar onToggleTheme={onToggleTheme} />);

      expect(screen.getByText('Tempo')).toBeInTheDocument();
    });

    it('renders with custom app name', () => {
      render(<Topbar appName="MyApp" onToggleTheme={onToggleTheme} />);

      expect(screen.getByText('MyApp')).toBeInTheDocument();
    });

    it('renders the Add task button', () => {
      render(<Topbar onToggleTheme={onToggleTheme} />);

      expect(screen.getByText('Add task')).toBeInTheDocument();
    });

    it('renders the theme toggle button', () => {
      render(<Topbar onToggleTheme={onToggleTheme} />);

      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    });

    it('displays first character of app name in icon badge', () => {
      render(<Topbar appName="Tasks" onToggleTheme={onToggleTheme} />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onAddTask when Add task button is clicked', () => {
      const onAddTask = jest.fn();

      render(<Topbar onAddTask={onAddTask} onToggleTheme={onToggleTheme} />);

      fireEvent.click(screen.getByText('Add task'));

      expect(onAddTask).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleTheme with false when isDark is true', () => {
      render(<Topbar onToggleTheme={onToggleTheme} isDark={true} />);

      fireEvent.click(screen.getByLabelText('Toggle theme'));

      expect(onToggleTheme).toHaveBeenCalledWith(false);
    });

    it('calls onToggleTheme with true when isDark is false', () => {
      render(<Topbar onToggleTheme={onToggleTheme} isDark={false} />);

      fireEvent.click(screen.getByLabelText('Toggle theme'));

      expect(onToggleTheme).toHaveBeenCalledWith(true);
    });
  });
});
