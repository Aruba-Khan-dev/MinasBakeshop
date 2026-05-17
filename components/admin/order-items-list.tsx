import type { ReactNode } from 'react';
import type { OrderItem } from '@/lib/supabase';

export default function OrderItemsList({ items }: { items: OrderItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-[#98898D]">No items in this order.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="rounded-2xl border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4 space-y-3">
          <div className="flex justify-between gap-4">
            <p className="font-bold text-[#2C2C2C]">{item.name}</p>
            <p className="text-[#2C2C2C] shrink-0">
              Rs. {(item.pricePerItem * item.quantity).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-1.5 text-sm text-[#98898D]">
            {item.flavour && item.flavour !== 'None' && !item.cakeFlavour && (
              <Row label="Flavour" value={item.flavour} />
            )}
            {item.cakeFlavour && <Row label="Cake flavour" value={item.cakeFlavour} />}
            {item.cupcakeFlavour && <Row label="Cupcake flavour" value={item.cupcakeFlavour} />}
            {item.shape && <Row label="Shape" value={item.shape} />}
            <Row label="Size" value={item.size} />
            <Row label="Quantity" value={String(item.quantity)} />
            <Row label="Unit price" value={`Rs. ${item.pricePerItem.toLocaleString()}`} />
            {item.addOns?.length > 0 && (
              <Row label="Add-ons" value={item.addOns.map((a) => a.replace(/\s*\(.*?\)/g, '')).join(', ')} />
            )}
            {item.messageOnCake && <Row label="Message on cake" value={`"${item.messageOnCake}"`} />}
            {item.theme && <Row label="Theme" value={item.theme} />}
            {item.colorPreferences && <Row label="Colors" value={item.colorPreferences} />}
            {item.referenceImage && (
              <Row
                label="Reference"
                value={
                  item.referenceImage.startsWith('http') ? (
                    <a href={item.referenceImage} target="_blank" rel="noreferrer" className="text-[#F283AE] hover:underline break-all">
                      View image
                    </a>
                  ) : (
                    item.referenceImage
                  )
                }
              />
            )}
            {item.specialInstructions && <Row label="Instructions" value={item.specialInstructions} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-[#2C2C2C] text-right">{value}</span>
    </div>
  );
}
