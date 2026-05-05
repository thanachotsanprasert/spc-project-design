import { apiClient } from './client';
import { StockLot } from '../types';

export const getStock = async (): Promise<StockLot[]> => {
  const { data } = await apiClient.get<StockLot[]>('/stock');
  return data;
};

export const updateStockLot = async (id: string, updates: Partial<StockLot>): Promise<StockLot> => {
  const { data } = await apiClient.patch<StockLot>(`/stock/${id}`, updates);
  return data;
};
