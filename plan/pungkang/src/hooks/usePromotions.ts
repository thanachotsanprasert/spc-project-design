import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPromotions, updatePromotion, deletePromotion } from '../api/promotions';
import { Promotion } from '../types';

export const usePromotions = () => {
  const queryClient = useQueryClient();

  const promotionsQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: getPromotions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Promotion> }) => 
      updatePromotion(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  return {
    promotions: promotionsQuery.data ?? [],
    isLoading: promotionsQuery.isLoading,
    isError: promotionsQuery.isError,
    updatePromotion: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deletePromotion: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
