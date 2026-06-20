import React, { useState } from 'react';
import './global.css';
import { AppLayout, LoginPage, SignupPage } from './pages';
import { Topbar } from '@/components';
import { cn } from './lib/utils';

export default function App() {
  const [isDark, setDarkMode] = useState<boolean>(true);

  return (
    <div className={cn(isDark ? 'dark' : 'light')}>
      <div className="h-dvh bg-background overflow-y-hidden">
        <Topbar onToggleTheme={setDarkMode} isDark={isDark} />
        <SignupPage />
      </div>
    </div>
  );
}
