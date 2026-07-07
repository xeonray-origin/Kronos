import React, { useEffect } from 'react';
import { Sidebar, TaskList, Timer } from '@/components';
import { useTasks } from '@/hooks/useTasks';
import type { ITask } from '@/types';

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
