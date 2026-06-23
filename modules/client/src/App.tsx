import { Topbar, CreateTaskModal } from '@/components';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import './global.css';
import { AppLayout, AuthLayout } from './layouts';
import { cn } from './lib/utils';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface TaskListItem {
  id: string;
  status: TaskStatus;
  title: string;
  dueDate?: string;
  dueDateMuted?: boolean;
  label?: string;
  labels?: string[];
  project?: string;
  priority?: 'none' | 'low' | 'medium' | 'high';
  completed?: boolean;
  progress?: { filled: number; total: number };
  flagColor?: 'orange' | 'blue' | 'gray';
  showTimer?: boolean;
}

const SAMPLE_TASKS: TaskListItem[] = [
  {
    id: '1',
    status: 'todo',
    title: 'Review pull request #482',
    labels: ['#code'],
    flagColor: 'orange',
    showTimer: true,
    priority: 'medium',
  },
  {
    id: '2',
    status: 'todo',
    title: 'Reply to investor email',
    dueDate: 'Today',
    flagColor: 'orange',
    showTimer: true,
    priority: 'high',
  },
  {
    id: '3',
    status: 'todo',
    title: 'Update component library docs',
    labels: ['#docs'],
    flagColor: 'blue',
    showTimer: true,
    priority: 'low',
  },
  {
    id: '4',
    status: 'todo',
    title: 'Plan sprint retro',
    dueDate: 'Tomorrow',
    dueDateMuted: true,
    flagColor: 'orange',
    showTimer: true,
    priority: 'medium',
  },
  {
    id: '5',
    status: 'todo',
    title: 'Book dentist appointment',
    labels: ['#errand'],
    flagColor: 'blue',
    showTimer: true,
    priority: 'low',
  },
  {
    id: '6',
    status: 'todo',
    title: 'Draft blog post on focus rituals',
    labels: ['#writing'],
    dueDate: 'Tomorrow',
    dueDateMuted: true,
    flagColor: 'orange',
    showTimer: true,
    priority: 'medium',
  },
  {
    id: '7',
    status: 'todo',
    title: 'Buy groceries',
    labels: ['#errand'],
    flagColor: 'gray',
    showTimer: true,
    priority: 'none',
  },
  {
    id: '8',
    status: 'in-progress',
    title: 'Finalize Q3 roadmap deck',
    progress: { filled: 4, total: 5 },
    labels: ['#roadmap'],
    dueDate: 'Today',
    flagColor: 'orange',
    showTimer: true,
    priority: 'high',
  },
  {
    id: '9',
    status: 'in-progress',
    title: 'Sketch onboarding empty states',
    progress: { filled: 1, total: 3 },
    labels: ['#ui'],
    flagColor: 'orange',
    showTimer: true,
    priority: 'medium',
  },
  {
    id: '10',
    status: 'in-progress',
    title: 'Refactor auth middleware',
    progress: { filled: 3, total: 5 },
    labels: ['#code', '#backend'],
    flagColor: 'orange',
    showTimer: true,
    priority: 'high',
  },
  {
    id: '11',
    status: 'done',
    title: 'Export brand assets for marketing',
    completed: true,
    progress: { filled: 1, total: 1 },
    flagColor: 'blue',
    showTimer: true,
  },
  {
    id: '12',
    status: 'done',
    title: 'Weekly 1:1 notes',
    completed: true,
    progress: { filled: 1, total: 1 },
    flagColor: 'orange',
    showTimer: true,
  },
];

export default function App() {
  const [isDark, setDarkMode] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskListItem[]>(SAMPLE_TASKS);

  const handleAddTask = (newTask: {
    title: string;
    description?: string;
    dueDate?: string;
    project?: string;
  }) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        status: 'todo',
        title: newTask.title,
        dueDate: newTask.dueDate,
        project: newTask.project,
        showTimer: true,
        flagColor: 'gray',
        priority: 'none',
      },
    ]);
  };

  return (
    <div className={cn(isDark ? 'dark' : 'light')}>
      <div className="h-dvh bg-background overflow-y-hidden">
        <Topbar
          onToggleTheme={setDarkMode}
          isDark={isDark}
          onAddTask={() => setIsModalOpen(true)}
        />
        <CreateTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
        />
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/dashboard" element={<AppLayout tasks={tasks} />} />
        </Routes>
      </div>
    </div>
  );
}
