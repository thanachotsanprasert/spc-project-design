import { apiClient } from './client';
import { Staff } from '../types';

export const getStaff = async (): Promise<Staff[]> => {
  const { data } = await apiClient.get<Staff[]>('/staff');
  return data;
};

export const updateStaffStatus = async (id: string, isLocked: boolean): Promise<Staff> => {
  const { data } = await apiClient.patch<Staff>(`/staff/${id}`, { isLocked });
  return data;
};

export const inviteStaff = async (email: string, role: string): Promise<Staff> => {
  const { data } = await apiClient.post<Staff>('/staff/invite', { email, role });
  return data;
};
