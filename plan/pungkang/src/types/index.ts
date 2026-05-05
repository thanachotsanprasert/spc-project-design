// Core types
export type OrderStatus = 'New' | 'Cooking' | 'Ready' | 'Paid' | 'Delivered' | 'Cancelled'
export type OrderType = 'In-Restaurant' | 'Take Away' | 'Delivery'
export type TableStatus = 'Available' | 'Eating' | 'Cooking' | 'Payment'
export type StockStatus = 'Good' | 'Low Stock' | 'Exp Soon' | 'Empty'
export type PromoStatus = 'Active' | 'ExpSoon' | 'Scheduled' | 'Expired'
export type CustomerTier = 'VIP' | 'Gold' | 'Silver' | 'Basic'
export type StaffRole = 'owner' | 'manager' | 'cashier' | 'server' | 'kitchen'
export type WasteReason = 'Expired' | 'Wrong Order' | 'Accident/Spill' | 'Quality Control'
export type Urgency = 'urgent' | 'new' | 'normal'

// Entity interfaces
export interface Order {
  id: string;
  type: OrderType;
  tableId?: string;
  staffId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  area: string;
  status: TableStatus;
  currentOrderId?: string;
  seatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  description?: string;
}

export interface StockLot {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate: string | null;
  reorderPoint: number;
  active: boolean;
}

export interface WasteEntry {
  id: string;
  date: string;
  itemName: string;
  reason: WasteReason;
  quantity: number;
  unit: string;
  estimatedCost: number;
  recordedBy: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  totalAmountSaved: number;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lineId?: string;
  tier: CustomerTier;
  points: number;
  totalSpent: number;
  orderCount: number;
  lastVisit: string;
  lastChannel: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  managerId?: string;
  area: string;
  lastLogin: string;
  isLocked: boolean;
  isPending?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  urgency: Urgency;
  read: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface AIContext {
  page: string;
  contextData: Record<string, unknown>;
}
