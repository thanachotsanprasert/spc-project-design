import { 
  OrderStatus, 
  OrderType, 
  StockStatus, 
  PromoStatus, 
  TableStatus, 
  CustomerTier, 
  StaffRole, 
  WasteReason 
} from '../types';

export interface StyleObject {
  bg: string;
  text: string;
  border?: string;
}

export const ORDER_STATUS_STYLES: Record<OrderStatus, StyleObject> = {
  New: { bg: '#D0D5DE', text: '#1A2333' },
  Cooking: { bg: '#FEF3E2', text: '#C96A00' },
  Ready: { bg: '#E1F5EE', text: '#0F6E56' },
  Paid: { bg: '#D6DBE4', text: '#1A2333' },
  Delivered: { bg: '#D6DBE4', text: '#1A2333' },
  Cancelled: { bg: '#FCEBEB', text: '#E24B4A' },
};

export const ORDER_TYPE_STYLES: Record<OrderType, StyleObject> = {
  'In-Restaurant': { bg: '#E1F5EE', text: '#0F6E56' },
  Delivery: { bg: '#E8EBF0', text: '#3D4A5C' },
  'Take Away': { bg: '#FEF3E2', text: '#C96A00' },
};

export const STOCK_STATUS_STYLES: Record<StockStatus, StyleObject> = {
  Good: { bg: 'transparent', text: 'inherit' }, // Good usually doesn't show a badge
  'Exp Soon': { bg: '#FEF3E2', text: '#C96A00' },
  'Low Stock': { bg: '#FCEBEB', text: '#E24B4A' },
  Empty: { bg: '#F9FAFB', text: '#9AA3AE', border: '#E8EBF0' },
};

export const PROMO_STATUS_STYLES: Record<PromoStatus, StyleObject> = {
  Active: { bg: '#E1F5EE', text: '#0F6E56' },
  ExpSoon: { bg: 'transparent', text: '#C96A00' }, // Plan says "expiry date shown in #C96A00"
  Scheduled: { bg: 'transparent', text: '#9AA3AE' }, // Plan says "label #9AA3AE"
  Expired: { bg: 'transparent', text: '#E24B4A' }, // Plan says "label #E24B4A"
};

export const TABLE_STATUS_STYLES: Record<TableStatus, StyleObject & { accent: string }> = {
  Available: { bg: 'transparent', text: '#9AA3AE', accent: '#1D9E75' },
  Eating: { bg: '#E1F5EE66', text: '#0F6E56', accent: '#0F6E56' },
  Cooking: { bg: '#FEF3E266', text: '#C96A00', accent: '#C96A00' },
  Payment: { bg: '#FCEBEB66', text: '#E24B4A', accent: '#E24B4A' },
};

export const CUSTOMER_TIER_STYLES: Record<CustomerTier, StyleObject> = {
  VIP: { bg: '#FEF3E2', text: '#C96A00', border: '#FDE5B4' },
  Gold: { bg: '#FCEBEB', text: '#E24B4A', border: '#FAD6D6' },
  Silver: { bg: '#E8EBF0', text: '#3D4A5C', border: '#C8CDD6' },
  Basic: { bg: '#F9FAFB', text: '#6B7A8D', border: '#E8EBF0' },
};

export const STAFF_ROLE_STYLES: Record<StaffRole, StyleObject> = {
  owner: { bg: '#D6DBE4', text: '#1A2333' },
  manager: { bg: '#D6DBE4', text: '#1A2333' },
  cashier: { bg: '#E1F5EE', text: '#0F6E56' },
  server: { bg: '#E1F5EE', text: '#0F6E56' },
  kitchen: { bg: '#FCEBEB', text: '#E24B4A' },
};

export const WASTE_REASON_STYLES: Record<WasteReason, StyleObject> = {
  Expired: { bg: '#FCEBEB', text: '#E24B4A' },
  'Wrong Order': { bg: '#FEF3E2', text: '#C96A00' },
  'Accident/Spill': { bg: '#E8EBF0', text: '#3D4A5C' },
  'Quality Control': { bg: '#E8EBF0', text: '#3D4A5C' },
};
