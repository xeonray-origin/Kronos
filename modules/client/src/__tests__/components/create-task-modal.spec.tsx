import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreateTaskModal } from '@/components';

describe('CreateTaskModal', () => {
  const setup = (open = true, onSubmit = jest.fn().mockResolvedValue(undefined)) => {
    const onClose = jest.fn();
    render(<CreateTaskModal open={open} onClose={onClose} onSubmit={onSubmit} />);
    return { onClose, onSubmit };
  };

  const submit = async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create task' }));
    });
  };

  const typeTitle = (value: string) =>
    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value } });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByText('New task')).not.toBeInTheDocument();
  });

  it('submits with only a title, omitting optional fields', async () => {
    const { onClose, onSubmit } = setup();

    typeTitle('Write tests');
    await submit();

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Write tests',
      description: undefined,
      dueDate: undefined,
      labels: undefined,
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('submits with all fields, sending the due date as an ISO string', async () => {
    jest.useFakeTimers({ now: new Date(2026, 6, 18), doNotFake: ['queueMicrotask'] });
    const { onSubmit } = setup();

    typeTitle('Ship feature');
    fireEvent.change(screen.getByPlaceholderText('Add a description...'), {
      target: { value: 'the details' },
    });

    fireEvent.click(screen.getByText('Pick a date'));
    fireEvent.click(
      document.querySelector(`[data-day="${new Date(2026, 6, 20).toLocaleDateString()}"]`)!,
    );

    fireEvent.click(screen.getByRole('button', { name: /add labels/i }));
    fireEvent.click(screen.getByRole('button', { name: 'frontend' }));

    await submit();

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship feature',
      description: 'the details',
      dueDate: '2026-07-20',
      labels: ['frontend'],
    });
  });

  it('does not submit when the title is blank', async () => {
    const { onSubmit } = setup();

    typeTitle('   ');
    await act(async () => {
      fireEvent.submit(screen.getByPlaceholderText('Task title').closest('form')!);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a validation error and does not submit when the title is too long', async () => {
    const { onSubmit } = setup();

    typeTitle('a'.repeat(256));
    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Title must not exceed 255 characters')).toBeInTheDocument();
  });

  it('shows a validation error when the description is too long', async () => {
    const { onSubmit } = setup();

    typeTitle('Write tests');
    fireEvent.change(screen.getByPlaceholderText('Add a description...'), {
      target: { value: 'a'.repeat(2001) },
    });
    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Description must not exceed 2000 characters')).toBeInTheDocument();
  });

  it('shows a validation error when a label is too long', async () => {
    const longLabel = 'a'.repeat(51);
    const { onSubmit } = setup();

    typeTitle('Write tests');
    fireEvent.click(screen.getByRole('button', { name: /add labels/i }));
    fireEvent.change(screen.getByPlaceholderText('Search labels...'), {
      target: { value: longLabel },
    });
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`Create.*${longLabel}`) }));
    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Label at index 0 must not exceed 50 characters')).toBeInTheDocument();
  });

  it('clears a field error when that field changes', async () => {
    setup();

    typeTitle('a'.repeat(256));
    await submit();
    expect(screen.getByText('Title must not exceed 255 characters')).toBeInTheDocument();

    typeTitle('Reasonable title');
    expect(screen.queryByText('Title must not exceed 255 characters')).not.toBeInTheDocument();
  });

  it('keeps the modal open and shows an error when submitting fails', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
    const { onClose } = setup(true, onSubmit);

    typeTitle('Write tests');
    await submit();

    expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Task title')).toHaveValue('Write tests');
  });

  it('clears the submit error once a retry succeeds', async () => {
    const onSubmit = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(undefined);
    const { onClose } = setup(true, onSubmit);

    typeTitle('Write tests');
    await submit();
    expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument();

    await submit();

    expect(screen.queryByText('Failed to create task. Please try again.')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalled();
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
