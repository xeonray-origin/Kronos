import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { authApi } from '@/api';
import { authActions, useAppDispatch, useAppSelector } from '@/store';

export function SessionGuard() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [checking, setChecking] = useState(!token);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || token) {
      return;
    }
    hasRun.current = true;

    authApi
      .refreshSession()
      .then((response) => {
        dispatch(authActions.setToken(response.token));
      })
      .catch(() => {})
      .finally(() => {
        setChecking(false);
      });
  }, [dispatch, token]);

  if (checking) {
    return (
      <div className="flex h-dvh items-center justify-center text-muted-foreground">Loading…</div>
    );
  }

  return <Outlet />;
}
