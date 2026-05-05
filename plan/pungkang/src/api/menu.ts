import { apiClient } from './client';
import { MenuItem } from '../types';

export const getMenu = async (): Promise<MenuItem[]> => {
  const { data } = await apiClient.get<MenuItem[]>('/menu');
  return data;
};

export const patchMenuItemAvailability = async (id: string, available: boolean): Promise<MenuItem> => {
  const { data } = await apiClient.patch<MenuItem>(`/menu/${id}`, { available });
  return data;
};
