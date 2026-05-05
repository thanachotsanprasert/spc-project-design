import { apiClient } from './client';

export interface DashboardSummary {
  revenue: number;
  orders: number;
  aov: number;
  activeTables: number;
}

export const getDashboardSummary = async (period: 'today' | 'week' | 'month'): Promise<DashboardSummary> => {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary', {
    params: { period },
  });
  return data;
};
