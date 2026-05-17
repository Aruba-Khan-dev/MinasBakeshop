'use client'

import { useEffect, useState } from 'react'
import type { Order } from '@/lib/supabase'
import { updateOrderStatus } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import OrderItemsList from '@/components/admin/order-items-list'

export default function OrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
}: {
  order: Order | null
  onClose: () => void
  onOrderUpdated?: (o: Order) => void
}) {
  const [open, setOpen] = useState(Boolean(order))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(order?.status || 'Pending')

  useEffect(() => {
    setOpen(!!order)
    setStatus(order?.status || 'Pending')
  }, [order])

  async function handleStatusChange(newStatus: string) {
    if (!order) return
    if (newStatus === status) return
    setSaving(true)
    try {
      const updated = await updateOrderStatus(order.id as string | number, newStatus)
      setStatus(updated.status || newStatus)
      onOrderUpdated?.(updated)
    } catch (err) {
      // minimal error feedback
      // eslint-disable-next-line no-console
      console.error('Failed to update order status', err)
      alert('Failed to update order status')
    } finally {
      setSaving(false)
    }
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) onClose()
  }

  if (!order) return null

  const isPending = order.status === 'Pending' || !order.status
  const isInProgress = order.status === 'In Progress'
  const isCompleted = order.status === 'Completed'
  const isCancelled = order.status === 'Cancelled'
  const isDelivery = order.delivery_method === 'delivery'
  const totalAmount = Number(order.total_amount || 0).toLocaleString()
  const deliveryLabel = isDelivery ? 'Delivery' : 'Pickup'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-1rem)] flex-col p-4 sm:max-w-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle>Order {order.order_number ?? order.id}</DialogTitle>
            <p className="mt-2 text-xs font-medium text-[#98898D]">
              Placed at {formatDateTime(order.created_at)}
            </p>
            <DialogDescription className="sr-only">
              Customer, delivery, and item details for this order.
            </DialogDescription>
          </div>
          <DialogClose />
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-1 sm:pr-4">
          <section className="rounded-3xl border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
            <h3 className="text-sm font-semibold text-[#2C2C2C]">Customer Information</h3>
            <div className="grid gap-2 pt-3 text-sm text-[#2C2C2C]">
              <DetailRow label="Name" value={order.customer_name} />
              <DetailRow label="Phone" value={order.phone} />
              <DetailRow label="Email" value={order.email ?? '—'} />
            </div>
          </section>

          <section className="rounded-3xl border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
            <h3 className="text-sm font-semibold text-[#2C2C2C]">Delivery Details</h3>
            <div className="grid gap-2 pt-3 text-sm text-[#2C2C2C]">
              <DetailRow label="Method" value={formatMethod(order.delivery_method)} />
              {isDelivery && <DetailRow label="Address" value={order.address ?? '—'} />}
              <DetailRow label={`${deliveryLabel} date`} value={formatDate(order.date)} />
              <DetailRow label="Time slot" value={order.time_slot || '—'} />
            </div>
          </section>

          <div className="rounded-3xl border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-semibold text-[#2C2C2C]">Items</h3>
              <span className="text-xs text-[#98898D]">{Array.isArray(order.items) ? order.items.length : 0} items</span>
            </div>
            <OrderItemsList items={Array.isArray(order.items) ? order.items : []} />
            <div className="mt-4 flex items-center justify-between border-t border-[#FAC1B5]/20 pt-4 text-base font-bold text-[#2C2C2C]">
              <span>Total Price</span>
              <span>Rs. {totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#FAC1B5]/20 pt-4 sm:flex-row sm:items-center sm:justify-end">
          {isPending && (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleStatusChange('Cancelled')}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#2C2C2C] transition disabled:opacity-60"
              >
                Cancel order
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleStatusChange('In Progress')}
                className="rounded-full bg-[#F283AE] px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Confirm order'}
              </button>
            </>
          )}

          {isInProgress && (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleStatusChange('Completed')}
              className="rounded-full bg-[#F283AE] px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Mark as completed'}
            </button>
          )}

          {(isCompleted || isCancelled) && (
            <div className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#2C2C2C]">
              {isCompleted ? 'Order completed' : 'Order cancelled'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <span className="text-[#98898D]">{label}</span>
      <span className="break-words text-right text-[#2C2C2C]">{value}</span>
    </div>
  )
}

function formatMethod(method: Order['delivery_method']) {
  return method === 'pickup' ? 'Pickup' : 'Delivery'
}

function formatDate(date: string) {
  if (!date) return '—'

  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(date?: string) {
  if (!date) return '—'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
