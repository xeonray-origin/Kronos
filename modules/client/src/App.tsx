import { Topbar, CreateTaskModal } from '@/components';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import './global.css';
import { AppLayout, AuthLayout } from './layouts';
import { cn } from './lib/utils';

export default function App() {
  const [isDark, setDarkMode] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onSubmit={() => setIsModalOpen(false)}
        />
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/dashboard" element={<AppLayout />} />
        </Routes>
      </div>
    </div>
  );
}
