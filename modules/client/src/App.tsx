import React, { useState } from 'react';
import './global.css';
import { Sidebar, TaskList, Timer, Topbar } from '@/components';

const SAMPLE_TASKS = [
  {
    id: '1',
    status: 'todo' as const,
    title: 'Review pull request #482',
    labels: ['#code'],
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'medium' as const,
  },
  {
    id: '2',
    status: 'todo' as const,
    title: 'Reply to investor email',
    dueDate: 'Today',
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'high' as const,
  },
  {
    id: '3',
    status: 'todo' as const,
    title: 'Update component library docs',
    labels: ['#docs'],
    flagColor: 'blue' as const,
    showTimer: true,
    priority: 'low' as const,
  },
  {
    id: '4',
    status: 'todo' as const,
    title: 'Plan sprint retro',
    dueDate: 'Tomorrow',
    dueDateMuted: true,
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'medium' as const,
  },
  {
    id: '5',
    status: 'todo' as const,
    title: 'Book dentist appointment',
    labels: ['#errand'],
    flagColor: 'blue' as const,
    showTimer: true,
    priority: 'low' as const,
  },
  {
    id: '6',
    status: 'todo' as const,
    title: 'Draft blog post on focus rituals',
    labels: ['#writing'],
    dueDate: 'Tomorrow',
    dueDateMuted: true,
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'medium' as const,
  },
  {
    id: '7',
    status: 'todo' as const,
    title: 'Buy groceries',
    labels: ['#errand'],
    flagColor: 'gray' as const,
    showTimer: true,
    priority: 'none' as const,
  },
  {
    id: '8',
    status: 'in-progress' as const,
    title: 'Finalize Q3 roadmap deck',
    progress: { filled: 4, total: 5 },
    labels: ['#roadmap'],
    dueDate: 'Today',
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'high' as const,
  },
  {
    id: '9',
    status: 'in-progress' as const,
    title: 'Sketch onboarding empty states',
    progress: { filled: 1, total: 3 },
    labels: ['#ui'],
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'medium' as const,
  },
  {
    id: '10',
    status: 'in-progress' as const,
    title: 'Refactor auth middleware',
    progress: { filled: 3, total: 5 },
    labels: ['#code', '#backend'],
    flagColor: 'orange' as const,
    showTimer: true,
    priority: 'high' as const,
  },
  {
    id: '11',
    status: 'done' as const,
    title: 'Export brand assets for marketing',
    completed: true,
    progress: { filled: 1, total: 1 },
    flagColor: 'blue' as const,
    showTimer: true,
  },
  {
    id: '12',
    status: 'done' as const,
    title: 'Weekly 1:1 notes',
    completed: true,
    progress: { filled: 1, total: 1 },
    flagColor: 'orange' as const,
    showTimer: true,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'board' | 'list'>('board');

  return (
    <div className="dark min-h-screen bg-background">
      <Topbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="pt-16 pl-[280px]">
        <Sidebar />
        <Timer />
        <TaskList tasks={SAMPLE_TASKS} />
      </main>
    </div>
  );
}
