import { useMutation, useQuery } from '@tanstack/react-query';
import { forgotPassword, getUserById, resetPassword, searchUsers } from '../services/users';

export const useUserById = (id: string, options = {}) =>
    useQuery({ queryKey: ['users', id], queryFn: () => getUserById(id), enabled: !!id, ...options });

export const useUserSearch = (q: string, options = {}) =>
    useQuery({ queryKey: ['users', 'search', q], queryFn: () => searchUsers(q), enabled: q.trim().length >= 2, ...options });

export const useForgotPassword = () =>
    useMutation({ mutationFn: (email: string) => forgotPassword(email) });

export const useResetPassword = () =>
    useMutation({ mutationFn: ({ email, newPassword }: { email: string; newPassword: string }) => resetPassword(email, newPassword) });