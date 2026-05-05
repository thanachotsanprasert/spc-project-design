import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, updateCustomer } from '../api/customers';
import { Customer } from '../types';

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Customer> }) => 
      updateCustomer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers: customersQuery.data ?? [],
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    updateCustomer: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
