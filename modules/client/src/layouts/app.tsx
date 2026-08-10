import React, { useEffect, useState } from 'react';
import { Sidebar, TaskList, Timer, TimerTaskCard } from '@/components';
import { useTasks } from '@/hooks/useTasks';
import { labelCounts } from '@/lib/labels';
import type { ITask } from '@/types';

export default function AppLayout() {
  const { tasks, apiStatus, activeLabel, fetchTasks, selectLabel, toggleTaskStatus } = useTasks();
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
        <Sidebar
          labels={labelCounts(tasks)}
          activeLabel={activeLabel}
          onSelectLabel={selectLabel}
        />
      </div>
      <div className="grow p-16">
        {apiStatus === 'error' ? (
          <p className="text-sm text-destructive text-center py-8">Couldn&apos;t load tasks</p>
        ) : (
          <TaskList
            tasks={tasks}
            activeLabel={activeLabel}
            onSelectTimerTask={handleSelectTimerTask}
            onToggleStatus={toggleTaskStatus}
          />
        )}
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
