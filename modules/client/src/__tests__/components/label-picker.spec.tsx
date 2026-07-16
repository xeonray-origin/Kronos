import { render, screen, fireEvent, within } from '@testing-library/react';
import { LabelPicker } from '@/components';

describe('LabelPicker', () => {
  const openPicker = () => fireEvent.click(document.querySelector('[aria-haspopup]')!);

  it('renders the placeholder when no labels are selected', () => {
    render(<LabelPicker value={[]} onChange={jest.fn()} />);
    expect(screen.getByText('Add labels...')).toBeInTheDocument();
  });

  it('renders chips and removes a label via the badge button', () => {
    const onChange = jest.fn();
    render(<LabelPicker value={['frontend', 'backend']} onChange={onChange} />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();

    const remove = screen.getByRole('button', { name: 'Remove frontend' });
    fireEvent.pointerDown(remove);
    fireEvent.click(remove);
    expect(onChange).toHaveBeenCalledWith(['backend']);
  });

  it('filters suggestions and adds a label from the list', () => {
    const onChange = jest.fn();
    render(<LabelPicker value={[]} onChange={onChange} />);
    openPicker();

    fireEvent.change(screen.getByPlaceholderText('Search labels...'), {
      target: { value: 'front' },
    });

    expect(screen.queryByRole('button', { name: 'backend' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'frontend' }));
    expect(onChange).toHaveBeenCalledWith(['frontend']);
  });

  it('marks a selected suggestion and removes it from the list', () => {
    const onChange = jest.fn();
    render(<LabelPicker value={['frontend']} onChange={onChange} />);
    openPicker();

    const suggestion = within(screen.getByRole('dialog')).getByRole('button', { name: 'frontend' });
    expect(suggestion.querySelector('svg.lucide-check')).toBeInTheDocument();

    fireEvent.click(suggestion);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('creates a new label from the query', () => {
    const onChange = jest.fn();
    render(<LabelPicker value={[]} onChange={onChange} />);
    openPicker();

    fireEvent.change(screen.getByPlaceholderText('Search labels...'), {
      target: { value: 'urgent' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create/ }));
    expect(onChange).toHaveBeenCalledWith(['urgent']);
  });

  it('shows the empty state when nothing matches and creation is not possible', () => {
    render(<LabelPicker value={['custom-x']} onChange={jest.fn()} />);
    openPicker();

    fireEvent.change(screen.getByPlaceholderText('Search labels...'), {
      target: { value: 'custom-x' },
    });

    expect(screen.getByText('No labels found.')).toBeInTheDocument();
  });
});
