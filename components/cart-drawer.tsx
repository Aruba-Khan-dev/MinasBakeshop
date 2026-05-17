'use client';

import { useCart } from '@/context/cart-context';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || pathname?.startsWith('/admin')) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = `*New Order - Minas Bakeshop*\n\n`;
    
    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}* (x${item.quantity})\n`;
      message += `- Size: ${item.size}\n`;
      message += `- Flavour: ${item.flavour}\n`;
      if (item.addOns.length > 0) message += `- Add-ons: ${item.addOns.join(', ')}\n`;
      if (item.messageOnCake) message += `- Message: ${item.messageOnCake}\n`;
      if (item.specialInstructions) message += `- Instructions: ${item.specialInstructions}\n`;
      message += `- Subtotal: Rs. ${(item.pricePerItem * item.quantity).toLocaleString()}\n\n`;
    });

    message += `*Total Amount: Rs. ${totalPrice.toLocaleString()}*\n`;
    message += `\nPlease confirm my order. Thanks!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923270203490?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[#FAC1B5]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[#F283AE]" size={24} />
              <h2 className="text-xl font-serif text-[#2C2C2C]">Your Cart ({totalItems})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#F0E8DF] rounded-full transition-colors">
              <X size={24} className="text-[#98898D]" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-[#F0E8DF] rounded-full flex items-center justify-center">
                  <ShoppingBag size={32} className="text-[#98898D]" />
                </div>
                <p className="text-[#98898D]">Your cart is empty.</p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-[#F283AE] text-white rounded-full text-sm font-semibold hover:bg-[#E86FA3] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 border-b border-[#FAC1B5]/10 pb-6">
                  <div className="w-20 h-20 rounded-xl bg-[#F0E8DF] overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-[#2C2C2C] truncate">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id, item.size, item.flavour, item.messageOnCake)}
                        className="text-[#98898D] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-[#98898D] mt-1">
                      {item.size} • {item.flavour}
                    </p>
                    {item.messageOnCake && (
                      <p className="text-xs text-[#F283AE] mt-1 italic italic">Msg: &quot;{item.messageOnCake}&quot;</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-[#F0E8DF]/50 rounded-lg px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#F283AE] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#F283AE] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-[#F283AE]">Rs. {(item.pricePerItem * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#FAC1B5]/20 bg-[#FFFBF8]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#2C2C2C] font-semibold">Subtotal</span>
                <span className="text-2xl font-bold text-[#F283AE]">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-[#F283AE] text-white rounded-full font-bold shadow-lg hover:bg-[#E86FA3] transition-all transform hover:scale-[1.02] active:scale-[0.98] block text-center"
              >
                Checkout
              </Link>
              <p className="text-[10px] text-center text-[#98898D] mt-4">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
