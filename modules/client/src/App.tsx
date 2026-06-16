import React from 'react';
import './global.css';
import { Task } from '@/components';
export default function App() {
  return (
    <h1 className="text-3xl font-bold underline italic">
      <Task title="Task test" description="Task Description" dueDate="12/12/2000" />
    </h1>
  );
}
