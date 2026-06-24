import React from 'react';
import { Sidebar, TaskList, Timer } from '@/components';

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

interface AppLayoutProps {
  tasks: TaskListItem[];
}

export default function AppLayout({ tasks }: AppLayoutProps) {
  return (
    <main className="flex h-[calc(100dvh-4rem)] w-full pt-16">
      <div className="hidden md:block flex-none h-dvh">
        <Sidebar />
      </div>
      <div className="grow p-16">
        <TaskList tasks={tasks} />
      </div>
      <div
        className="hidden lg:block float-right h-dvh 
      border min-w-sm pl-2 pt-5 justify-center mx-auto"
      >
        <Timer />
      </div>
    </main>
  );
}
