import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenu, patchMenuItemAvailability } from '../api/menu';

export const useMenu = () => {
  const queryClient = useQueryClient();

  const menuQuery = useQuery({
    queryKey: ['menu'],
    queryFn: getMenu,
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) => 
      patchMenuItemAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  return {
    menu: menuQuery.data ?? [],
    isLoading: menuQuery.isLoading,
    isError: menuQuery.isError,
    toggleAvailability: toggleAvailabilityMutation.mutate,
    isToggling: toggleAvailabilityMutation.isPending,
  };
};
