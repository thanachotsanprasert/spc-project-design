import { apiClient } from './client';
import { WasteEntry } from '../types';

export const getWaste = async (): Promise<WasteEntry[]> => {
  const { data } = await apiClient.get<WasteEntry[]>('/waste');
  return data;
};

export const createWasteEntries = async (entries: Partial<WasteEntry>[]): Promise<WasteEntry[]> => {
  const { data } = await apiClient.post<WasteEntry[]>('/waste', entries);
  return data;
};
