import { Topbar } from '@/components';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import './global.css';
import { AppLayout, AuthLayout } from './layouts';
import { cn } from './lib/utils';

export default function App() {
  const [isDark, setDarkMode] = useState<boolean>(true);

  return (
    <div className={cn(isDark ? 'dark' : 'light')}>
      <div className="h-dvh bg-background overflow-y-hidden">
        <Topbar onToggleTheme={setDarkMode} isDark={isDark} />
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/dashboard" element={<AppLayout />}></Route>
        </Routes>
      </div>
    </div>
  );
}
