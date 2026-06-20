import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/base';
import { LoginForm } from '@/components';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="size-14 bg-[#e05a4b] rounded-2xl flex items-center justify-center shadow-md">
          <CheckIcon className="text-white size-7" strokeWidth={3} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your Kronos account</p>
        </div>
      </div>

      <LoginForm />

      <p className="mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Button variant="link" className="h-auto p-0 text-sm font-bold text-foreground">
          Sign up free
        </Button>
      </p>
    </div>
  );
}
