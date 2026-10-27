import { render, screen, fireEvent } from '@testing-library/react';
import { UndoToast } from '@/components';

describe('UndoToast', () => {
  it('renders nothing when there are no pending deletes', () => {
    render(<UndoToast items={[]} onUndo={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows each deleted title and calls onUndo with its id', () => {
    const onUndo = jest.fn();
    render(
      <UndoToast
        items={[
          { id: '1', title: 'First' },
          { id: '2', title: 'Second' },
        ]}
        onUndo={onUndo}
      />,
    );

    expect(screen.getByText(/First/)).toBeInTheDocument();
    expect(screen.getByText(/Second/)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Undo' })[1]!);
    expect(onUndo).toHaveBeenCalledWith('2');
  });
});
