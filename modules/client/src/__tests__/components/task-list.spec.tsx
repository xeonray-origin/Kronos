import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '@/components';
import { TaskStatus, type ITask } from '@/types';

const FRONTEND_AUTH_TASK: ITask = {
  id: '1',
  status: TaskStatus.BACKLOG,
  title: 'Write docs',
  userId: 'u1',
  labels: ['frontend', 'auth'],
};
const FRONTEND_TASK: ITask = {
  id: '2',
  status: TaskStatus.DONE,
  title: 'Fix bug',
  userId: 'u1',
  labels: ['frontend'],
};
const UNLABELED_TASK: ITask = {
  id: '3',
  status: TaskStatus.BACKLOG,
  title: 'Triage inbox',
  userId: 'u1',
};

describe('TaskList', () => {
  it('renders an empty state when tasks array is empty', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('groups tasks by label alphabetically, repeating multi-label tasks in each section', () => {
    const { container } = render(<TaskList tasks={[FRONTEND_AUTH_TASK, FRONTEND_TASK]} />);

    const headings = [...container.querySelectorAll('section > div > span:nth-child(2)')].map(
      (node) => node.textContent,
    );
    expect(headings).toEqual(['auth', 'frontend']);

    expect(screen.getAllByText('Write docs')).toHaveLength(2);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders unlabeled tasks in a trailing No label section', () => {
    const { container } = render(<TaskList tasks={[UNLABELED_TASK, FRONTEND_TASK]} />);

    const headings = [...container.querySelectorAll('section > div > span:nth-child(2)')].map(
      (node) => node.textContent,
    );
    expect(headings).toEqual(['frontend', 'No label']);
    expect(screen.getByText('Triage inbox')).toBeInTheDocument();
  });

  it('renders only the matching section when activeLabel is set', () => {
    const { container } = render(
      <TaskList tasks={[FRONTEND_AUTH_TASK, UNLABELED_TASK]} activeLabel="auth" />,
    );

    const headings = [...container.querySelectorAll('section > div > span:nth-child(2)')].map(
      (node) => node.textContent,
    );
    expect(headings).toEqual(['auth']);
    expect(screen.queryByText('Triage inbox')).not.toBeInTheDocument();
  });

  it('forwards task id to onSelectTimerTask when clock icon is clicked', () => {
    const onSelectTimerTask = jest.fn();
    render(<TaskList tasks={[FRONTEND_TASK]} onSelectTimerTask={onSelectTimerTask} />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle task timer card' }));
    expect(onSelectTimerTask).toHaveBeenCalledWith('2');
  });

  it('forwards task id to onToggleStatus when the complete circle is clicked', () => {
    const onToggleStatus = jest.fn();
    render(<TaskList tasks={[FRONTEND_TASK]} onToggleStatus={onToggleStatus} />);

    fireEvent.click(screen.getByRole('button', { name: 'Complete task' }));
    expect(onToggleStatus).toHaveBeenCalledWith('2');
  });
});
