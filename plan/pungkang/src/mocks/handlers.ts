import { http, HttpResponse } from 'msw'
import { 
  Order, Table, MenuItem, StockLot, WasteEntry, 
  Promotion, Customer, Staff, Notification 
} from '../types'

const orders: Order[] = [
  {
    id: '1046',
    type: 'In-Restaurant',
    tableId: '05',
    staffId: 'TS',
    items: [{ menuItemId: '1', name: 'Family Set A', quantity: 1, price: 890 }],
    subtotal: 890,
    discount: 0,
    tax: 62.3,
    total: 952.3,
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '1045',
    type: 'Delivery',
    staffId: 'JS',
    items: [{ menuItemId: '2', name: 'Spicy Pork Ribs', quantity: 2, price: 250 }],
    subtotal: 500,
    discount: 50,
    tax: 31.5,
    total: 481.5,
    status: 'Cooking',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  }
]

const tables: Table[] = Array.from({ length: 15 }, (_, i) => ({
  id: (i + 1).toString().padStart(2, '0'),
  number: i + 1,
  seats: i % 3 === 0 ? 2 : i % 5 === 0 ? 6 : 4,
  area: i < 5 ? 'Window View' : i < 10 ? 'Main Hall' : 'VIP Zone',
  status: i === 4 ? 'Eating' : i === 0 ? 'Cooking' : i === 12 ? 'Payment' : i === 14 ? 'Payment' : 'Available',
  seatedAt: (i === 4 || i === 0 || i === 12 || i === 14) ? new Date(Date.now() - 1000 * 60 * 45).toISOString() : undefined,
}))

const menu: MenuItem[] = [
  { id: '1', name: 'Family Set A', category: 'Main', price: 890, available: true, description: 'A large set of signature pork ribs, rice, and sides.' },
  { id: '2', name: 'Spicy Pork Ribs', category: 'Main', price: 250, available: true, description: 'Slow-cooked ribs with our secret spicy sauce.' },
  { id: '3', name: 'Iced Tea', category: 'Drink', price: 45, available: true },
  { id: '4', name: 'Garlic Rice', category: 'Side', price: 35, available: true },
  { id: '5', name: 'Stir-fried Morning Glory', category: 'Side', price: 85, available: true },
  { id: '6', name: 'Mango Sticky Rice', category: 'Dessert', price: 120, available: true },
  { id: '7', name: 'Singha Beer', category: 'Drink', price: 90, available: false },
  { id: '8', name: 'Deep Fried Sea Bass', category: 'Main', price: 450, available: true },
]

const staff: Staff[] = [
  { id: 'TS', name: 'Thanachot S.', email: 'thanachot@pungkang.com', role: 'owner', area: 'Bangkok Branch', lastLogin: '2026-05-04', isLocked: false },
  { id: 'JS', name: 'Jane Smith', email: 'jane@pungkang.com', role: 'manager', area: 'Bangkok Branch', lastLogin: '2026-05-03', isLocked: false },
  { id: 'AK', name: 'Anan K.', email: 'anan@pungkang.com', role: 'cashier', area: 'Main Hall', lastLogin: '2026-05-04', isLocked: false },
  { id: 'ST', name: 'Somsak T.', email: 'somsak.t@pungkang.com', role: 'kitchen', area: 'Kitchen', lastLogin: '2026-05-02', isLocked: true },
  { id: 'PW', name: 'Preecha W.', email: 'preecha.w@pungkang.com', role: 'server', area: 'VIP Zone', lastLogin: '2026-05-04', isLocked: false, isPending: true },
]

export const handlers = [
  http.get('/api/orders', () => {
    return HttpResponse.json(orders)
  }),

  http.get('/api/tables', () => {
    return HttpResponse.json(tables)
  }),

  http.get('/api/menu', () => {
    return HttpResponse.json(menu)
  }),

  http.get('/api/stock', () => {
    return HttpResponse.json([
      { id: 'LOT-001', ingredientId: 'ING-001', ingredientName: 'Pork Belly', quantity: 5.5, unit: 'kg', price: 1200, expiryDate: '2026-05-10', reorderPoint: 2, active: true },
      { id: 'LOT-002', ingredientId: 'ING-002', ingredientName: 'Jasmine Rice', quantity: 0, unit: 'kg', price: 450, expiryDate: null, reorderPoint: 5, active: true },
    ])
  }),

  http.get('/api/waste', () => {
    return HttpResponse.json([
      { id: 'WST-001', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), itemName: 'Pork Belly', reason: 'Expired', quantity: 2.5, unit: 'kg', estimatedCost: 450, recordedBy: 'Thanachot S.' },
      { id: 'WST-002', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), itemName: 'Jasmine Rice', reason: 'Accident/Spill', quantity: 5, unit: 'kg', estimatedCost: 120, recordedBy: 'Thanachot S.' },
      { id: 'WST-003', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), itemName: 'Spicy Ribs', reason: 'Wrong Order', quantity: 1, unit: 'pcs', estimatedCost: 250, recordedBy: 'JS' },
    ])
  }),

  http.post('/api/waste', async ({ request }) => {
    const entries = await request.json() as any[]
    return HttpResponse.json(entries.map(e => ({ ...e, id: Math.random().toString(36).substr(2, 9) })))
  }),

  http.get('/api/promotions', () => {
    return HttpResponse.json([
      { id: '1', code: 'NEWYEAR2026', name: 'New Year 10%', discountType: 'percentage', discountValue: 10, startDate: '2026-01-01', endDate: '2026-12-31', usageCount: 150, totalAmountSaved: 4500, active: true }
    ])
  }),

  http.get('/api/customers', () => {
    return HttpResponse.json([
      { id: 'MEM-001', name: 'Anuchit Chalothorn', email: 'anuchit@example.com', phone: '081-234-5678', tier: 'VIP', points: 1250, totalSpent: 15400, orderCount: 12, lastVisit: '2026-04-20', lastChannel: 'In-Restaurant' },
      { id: 'MEM-002', name: 'Somsak Rakthai', email: 'somsak@example.com', phone: '082-345-6789', tier: 'Gold', points: 850, totalSpent: 8200, orderCount: 8, lastVisit: '2026-04-25', lastChannel: 'Delivery' },
      { id: 'MEM-003', name: 'Preecha Jaiyen', email: 'preecha@example.com', phone: '083-456-7890', tier: 'Silver', points: 420, totalSpent: 3500, orderCount: 4, lastVisit: '2026-05-01', lastChannel: 'Take Away' },
      { id: 'MEM-004', name: 'Wipawee Sookjai', email: 'wipawee@example.com', phone: '084-567-8901', tier: 'Basic', points: 150, totalSpent: 1200, orderCount: 2, lastVisit: '2026-05-03', lastChannel: 'In-Restaurant' },
      { id: 'MEM-005', name: 'Kitti Panit', email: 'kitti@example.com', phone: '085-678-9012', tier: 'VIP', points: 2100, totalSpent: 28000, orderCount: 25, lastVisit: '2026-05-04', lastChannel: 'In-Restaurant' },
    ])
  }),

  http.get('/api/staff', () => {
    return HttpResponse.json(staff)
  }),

  http.patch('/api/staff/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as Partial<Staff>
    const index = staff.findIndex(s => s.id === id)
    if (index > -1) {
      staff[index] = { ...staff[index], ...body }
      return HttpResponse.json(staff[index])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/dashboard/summary', ({ request }) => {
    const url = new URL(request.url)
    const period = url.searchParams.get('period') || 'week'
    
    return HttpResponse.json({
      revenue: period === 'today' ? 12450 : period === 'week' ? 85400 : 345000,
      orders: period === 'today' ? 42 : period === 'week' ? 285 : 1240,
      aov: 850,
      activeTables: 8
    })
  }),

  http.patch('/api/orders/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as Partial<Order>
    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex > -1) {
      orders[orderIndex] = { ...orders[orderIndex], ...body }
      return HttpResponse.json(orders[orderIndex])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as Order
    const newOrder = { ...body, id: Math.floor(Math.random() * 10000).toString() }
    orders.push(newOrder)
    return HttpResponse.json(newOrder)
  }),
]
