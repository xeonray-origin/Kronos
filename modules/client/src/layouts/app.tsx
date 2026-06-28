import React, { useEffect } from 'react';
import { Sidebar, TaskList, Timer } from '@/components';
import { useTasks } from '@/hooks/useTasks';
import type { ITask } from '@/types';

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

function toTaskListItem(task: ITask): TaskListItem {
  return {
    id: task._id,
    status: 'todo',
    title: task.title,
    dueDate: task.dueDate,
    label: task.label,
    project: task.project,
    priority: task.priority,
    showTimer: true,
    flagColor: 'gray',
  };
}

export default function AppLayout() {
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="flex h-[calc(100dvh-4rem)] w-full pt-16">
      <div className="hidden md:block flex-none h-dvh">
        <Sidebar />
      </div>
      <div className="grow p-16">
        <TaskList tasks={tasks.map(toTaskListItem)} />
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
