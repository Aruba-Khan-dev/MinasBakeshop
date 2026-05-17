import type { Order, OrderItem } from '@/lib/supabase';

export function normalizeOrderItems(items: Order['items']): OrderItem[] {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  const wrapped = items as { lineItems?: OrderItem[] };
  return wrapped.lineItems ?? [];
}

export function normalizeOrder(order: Order): Order {
  return { ...order, items: normalizeOrderItems(order.items) };
}

export function statusColor(status?: string) {
  if (status === 'Completed') return '#98B8B9';
  if (status === 'In Progress') return '#F283AE';
  if (status === 'Confirmed') return '#C6C870';
  if (status === 'Cancelled') return '#B03A2E';
  if (status === 'Pending') return '#9B9B9B';
  return '#9B9B9B';
}
