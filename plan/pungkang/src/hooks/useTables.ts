import { useQuery } from '@tanstack/react-query';
import { getTables } from '../api/tables';

export const useTables = () => {
  const tablesQuery = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
  });

  return {
    tables: tablesQuery.data ?? [],
    isLoading: tablesQuery.isLoading,
    isError: tablesQuery.isError,
  };
};
