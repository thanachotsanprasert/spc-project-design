import { apiClient } from './client';
import { Table } from '../types';

export const getTables = async (): Promise<Table[]> => {
  const { data } = await apiClient.get<Table[]>('/tables');
  return data;
};
