import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWaste, createWasteEntries } from '../api/waste';
import { WasteEntry } from '../types';

export const useWaste = () => {
  const queryClient = useQueryClient();

  const wasteQuery = useQuery({
    queryKey: ['waste'],
    queryFn: getWaste,
  });

  const recordWasteMutation = useMutation({
    mutationFn: (entries: Partial<WasteEntry>[]) => createWasteEntries(entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste'] });
    },
  });

  return {
    waste: wasteQuery.data ?? [],
    isLoading: wasteQuery.isLoading,
    isError: wasteQuery.isError,
    recordWaste: recordWasteMutation.mutate,
    isRecording: recordWasteMutation.isPending,
  };
};
