import { apiClient } from './client';
import { Promotion } from '../types';

export const getPromotions = async (): Promise<Promotion[]> => {
  const { data } = await apiClient.get<Promotion[]>('/promotions');
  return data;
};

export const updatePromotion = async (id: string, updates: Partial<Promotion>): Promise<Promotion> => {
  const { data } = await apiClient.patch<Promotion>(`/promotions/${id}`, updates);
  return data;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await apiClient.delete(`/promotions/${id}`);
};
