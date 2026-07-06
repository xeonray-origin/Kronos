import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@/components/base';
import { authApi } from '@/api';
import { useNavigate } from 'react-router';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const lastName = rest.join(' ');
      await authApi.initiateRegister({
        name: { firstName: firstName!, lastName },
        email,
        phoneNumber,
        password,
        confirmPassword,
        role: 'user',
      });
      navigate('/');
    } catch (e) {}
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col gap-4 pt-2 pb-2">
        <Button variant="outline" className="w-full h-10 gap-2">
          <GoogleIcon />
          Continue with Google
        </Button>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="mx-3 bg-card px-1 text-xs text-muted-foreground uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Full name</label>
          <Input
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Email address</label>
          <Input
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Phone number</label>
          <Input
            type="tel"
            placeholder="+1 555 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-9"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Confirm password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-9"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              aria-label="Toggle confirm password visibility"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </div>

        <Button
          className="w-full h-10 bg-foreground text-background hover:bg-foreground/85"
          type="button"
          onClick={handleSubmit}
        >
          Sign up
        </Button>
      </CardContent>
    </Card>
  );
}
