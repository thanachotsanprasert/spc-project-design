import { apiClient } from './client';
import { Order, OrderStatus } from '../types';

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('/orders');
  return data;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, { status });
  return data;
};

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const { data } = await apiClient.post<Order>('/orders', order);
  return data;
};
