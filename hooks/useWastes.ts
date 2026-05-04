import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteWaste, getAllWasteListings, getWasteById, getWasteByUser, updateWaste, uploadWaste } from '../services/wastes';

export const useWasteById = (id: string, options = {}) =>
  useQuery({ queryKey: ['wastes', id], queryFn: () => getWasteById(id), ...options });

export const useUploadWaste = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: uploadWaste, onSuccess: () => qc.invalidateQueries({ queryKey: ['wastes'] }) });
};

export const useUpdateWaste = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateWaste(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['wastes'] });
      qc.invalidateQueries({ queryKey: ['wastes', id] });
    },
  });
};

export const useDeleteWaste = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteWaste(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['wastes'] }) });
};

export const useWasteEntriesOfUser = (userId: string, options = {}) =>
  useQuery({
    queryKey: ['wastes', 'user', userId],
    queryFn: () => getWasteByUser(userId),
    ...options
  });

export const useAllWaste = (options = {}) => {
  return useQuery({
    queryKey: ['waste', 'all'],
    queryFn: () => getAllWasteListings(),
    ...options,
  });
};