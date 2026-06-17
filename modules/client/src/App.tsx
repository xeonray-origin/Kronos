import React from 'react';
import './global.css';
import { Sidebar } from '@/components';

export default function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar />
    </div>
  );
}
