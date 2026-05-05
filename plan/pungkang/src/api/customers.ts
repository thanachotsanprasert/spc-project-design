import { apiClient } from './client';
import { Customer } from '../types';

export const getCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get<Customer[]>('/customers');
  return data;
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  const { data } = await apiClient.patch<Customer>(`/customers/${id}`, updates);
  return data;
};
