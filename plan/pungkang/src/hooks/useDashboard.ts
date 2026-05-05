import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../api/dashboard';

export const useDashboard = (period: 'today' | 'week' | 'month' = 'week') => {
  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary', period],
    queryFn: () => getDashboardSummary(period),
  });

  return {
    summary: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
  };
};
