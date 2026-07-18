import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskModal } from '@/components';

describe('CreateTaskModal', () => {
  const setup = (open = true) => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<CreateTaskModal open={open} onClose={onClose} onSubmit={onSubmit} />);
    return { onClose, onSubmit };
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByText('New task')).not.toBeInTheDocument();
  });

  it('submits with only a title, omitting optional fields', () => {
    const { onClose, onSubmit } = setup();

    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: 'Write tests' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Write tests',
      description: undefined,
      dueDate: undefined,
      labels: undefined,
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('submits with all fields including labels', () => {
    jest.useFakeTimers({ now: new Date(2026, 6, 18), doNotFake: ['queueMicrotask'] });
    const { onSubmit } = setup();

    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: 'Ship feature' },
    });
    fireEvent.change(screen.getByPlaceholderText('Add a description...'), {
      target: { value: 'the details' },
    });

    fireEvent.click(screen.getByText('Pick a date'));
    fireEvent.click(
      document.querySelector(`[data-day="${new Date(2026, 6, 20).toLocaleDateString()}"]`)!,
    );

    fireEvent.click(screen.getByRole('button', { name: /add labels/i }));
    fireEvent.click(screen.getByRole('button', { name: 'frontend' }));

    fireEvent.click(screen.getByRole('button', { name: 'Create task' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship feature',
      description: 'the details',
      dueDate: 'Jul 20, 2026',
      labels: ['frontend'],
    });
  });

  it('does not submit when the title is blank', () => {
    const { onSubmit } = setup();

    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: '   ' },
    });
    fireEvent.submit(screen.getByPlaceholderText('Task title').closest('form')!);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('closes when Cancel is clicked', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when Escape is pressed', () => {
    const { onClose } = setup();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
