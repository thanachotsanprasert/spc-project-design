import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStock, updateStockLot } from '../api/stock';
import { StockLot } from '../types';

export const useStock = () => {
  const queryClient = useQueryClient();

  const stockQuery = useQuery({
    queryKey: ['stock'],
    queryFn: async () => {
      const data = await getStock();
      console.log('useStock hook: raw data from getStock():', data);
      return data;
    },
  });

  const updateLotMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StockLot> }) => 
      updateStockLot(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });

  // Ensure we always return an array for 'stock'
  const stock = Array.isArray(stockQuery.data) ? stockQuery.data : [];

  return {
    stock,
    isLoading: stockQuery.isLoading,
    isError: stockQuery.isError,
    updateLot: updateLotMutation.mutate,
    isUpdating: updateLotMutation.isPending,
  };
};
