import React, { useState } from 'react';
import './global.css';
import { Sidebar, Topbar } from '@/components';

export default function App() {
  const [currentView, setCurrentView] = useState<'board' | 'list'>('board');

  return (
    <div className="dark min-h-screen bg-background">
      <Topbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="pt-16 pl-[280px]">
        <Sidebar />
      </main>
    </div>
  );
}
