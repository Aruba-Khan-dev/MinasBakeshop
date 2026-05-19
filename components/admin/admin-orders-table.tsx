'use client';

import { useState } from 'react';
import type { Order } from '@/lib/supabase';
import { normalizeOrder, statusColor } from '@/lib/order-utils';
import OrderDetailModal from '@/components/admin/order-detail-modal';

export default function AdminOrdersTable({ 
  orders: initialOrders,
  isCustom = false 
}: { 
  orders: Order[];
  isCustom?: boolean;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  function handleOrderUpdated(updated: Order) {
    const normalized = normalizeOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === normalized.id ? normalized : o)));
    setSelectedOrder(normalized);
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-[#FAC1B5]/20 overflow-hidden">
        <div className="space-y-3 p-4 md:hidden">
          {orders.length === 0 ? (
            <div className="py-10 text-center text-[#98898D]">No orders found yet.</div>
          ) : (
            orders.map((order) => {
              const o = normalizeOrder(order);
              return (
                <div key={String(o.id)} className="rounded-lg border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-[#2C2C2C]">{o.order_number || o.id}</p>
                      <p className="mt-1 break-words text-sm text-[#2C2C2C]">{o.customer_name}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: statusColor(o.status) }}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#98898D]">Date</p>
                      <p className="font-medium text-[#2C2C2C]">{o.created_at?.slice(0, 10) || o.date || '—'}</p>
                    </div>
                    {!isCustom && (
                      <div>
                        <p className="text-[#98898D]">Amount</p>
                        <p className="font-semibold text-[#2C2C2C]">Rs. {Number(o.total_amount || 0).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(o)}
                    className="mt-4 w-full rounded-full border border-[#F283AE]/30 px-4 py-2 text-sm font-semibold text-[#F283AE] transition-colors hover:bg-[#F283AE]/10"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-[#FAC1B5]/20 bg-[#F0E8DF]/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Status</th>
                {!isCustom && <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Amount</th>}
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={isCustom ? 5 : 6} className="px-6 py-10 text-center text-[#98898D]">
                    No orders found yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const o = normalizeOrder(order);
                  return (
                    <tr
                      key={String(o.id)}
                      className="border-b border-[#FAC1B5]/20 hover:bg-[#F0E8DF]/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#2C2C2C]">{o.order_number || o.id}</span>
                      </td>
                      <td className="px-6 py-4 text-[#2C2C2C]">{o.customer_name}</td>
                      <td className="px-6 py-4 text-[#98898D]">{o.created_at?.slice(0, 10) || o.date || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: statusColor(o.status) }}
                        >
                          {o.status}
                        </span>
                      </td>
                      {!isCustom && (
                        <td className="px-6 py-4 font-semibold text-[#2C2C2C]">
                          Rs. {Number(o.total_amount || 0).toLocaleString()}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="text-[#F283AE] hover:underline text-sm font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[#98898D] text-sm mt-4">Total Orders: {orders.length}</p>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdated={handleOrderUpdated}
      />
    </>
  );
}
