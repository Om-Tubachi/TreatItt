import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services/users';

export const useUserById = (id: string, options = {}) =>
  useQuery({ queryKey: ['users', id], queryFn: () => getUserById(id), enabled: !!id, ...options });