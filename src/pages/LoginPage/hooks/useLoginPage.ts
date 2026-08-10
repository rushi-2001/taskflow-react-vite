import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/auth/auth.actions';
import { clearError } from '@/store/auth/authSlice';
import type { AuthCredentials } from '@/types/user.types';

export function useLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const [credentialsToFill, setCredentialsToFill] = useState<AuthCredentials | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLoginSubmit = useCallback(
    (credentials: AuthCredentials) => {
      dispatch(login(credentials));
    },
    [dispatch]
  );

  const handleFillCredentials = useCallback((email: string, password: string) => {
    setCredentialsToFill({ email, password });
  }, []);

  return {
    status,
    error,
    credentialsToFill,
    handleLoginSubmit,
    handleFillCredentials,
  };
}
