import React, { useEffect, useState } from 'react';
import { Sidebar, TaskList, Timer, TimerTaskCard } from '@/components';
import { useTasks } from '@/hooks/useTasks';
import type { ITask } from '@/types';

export default function AppLayout() {
  const { tasks, fetchTasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, []);

  const selectedTask: ITask | undefined = tasks.find((t) => t.id === selectedTaskId);

  function handleSelectTimerTask(taskId: string) {
    setSelectedTaskId((current) => (current === taskId ? undefined : taskId));
  }

  return (
    <main className="flex h-[calc(100dvh-4rem)] w-full pt-16">
      <div className="hidden md:block flex-none h-dvh">
        <Sidebar />
      </div>
      <div className="grow p-16">
        <TaskList tasks={tasks} onSelectTimerTask={handleSelectTimerTask} />
      </div>
      <div
        className="hidden lg:block float-right h-dvh
      border min-w-sm pl-2 pt-5 justify-center mx-auto"
      >
        <div className="flex flex-col gap-6">
          <Timer />
          {selectedTask && (
            <TimerTaskCard task={selectedTask} onClose={() => setSelectedTaskId(undefined)} />
          )}
        </div>
      </div>
    </main>
  );
}
