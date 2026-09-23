import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useRegister() {
  return useMutation({
    mutationFn: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload) => api.post('/auth/verify-email', payload).then((res) => res.data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload) => api.post('/auth/forgot-password', payload).then((res) => res.data),
  });
}
