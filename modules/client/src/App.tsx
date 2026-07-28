import { Topbar, CreateTaskModal } from '@/components';
import { useEffect, useState } from 'react';
import './global.css';
import { AppRoutes } from './routes';
import { cn } from './lib/utils';
import { useAppSelector } from './store';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [isDark, setDarkMode] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { createTask } = useTasks();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div className={cn(isDark ? 'dark' : 'light')}>
      <div className="h-dvh bg-background overflow-y-hidden">
        <Topbar
          onToggleTheme={setDarkMode}
          isDark={isDark}
          onAddTask={() => setIsModalOpen(true)}
          isLoggedIn={isLoggedIn}
        />
        <CreateTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (task) => {
            await createTask(task);
          }}
        />
        <AppRoutes />
      </div>
    </div>
  );
}
