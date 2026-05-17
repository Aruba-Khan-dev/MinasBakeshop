'use client';

import { useCallback, useMemo, useState } from 'react';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, ArrowLeft, Truck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/footer';
import { createOrder } from '@/lib/supabase';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import {
  trimValue,
  normalizePhoneDigits,
  validateName,
  validatePakistaniPhone,
  validateEmail,
  validateAddress,
  validateFutureDate,
  validateTimeSlot,
  hasErrors,
} from '@/lib/validation';

const INPUT_CLASS =
  'w-full bg-[#F0E8DF]/20 border border-[#FAC1B5]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#F283AE] transition-all';

const TIME_SLOTS = [
  '9:00 AM – 12:00 PM',
  '12:00 PM – 3:00 PM',
  '3:00 PM – 6:00 PM',
  '6:00 PM – 9:00 PM'
];

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  
  // Customer Info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Details
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const minDate = useMemo(
    () => new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    []
  );

  const validateAll = useCallback(() => {
    const next: Record<string, string | undefined> = {
      name: validateName(name, 'Full name'),
      phone: validatePakistaniPhone(phone),
      email: validateEmail(email, false),
      date: validateFutureDate(date),
      timeSlot: validateTimeSlot(selectedTimeSlot),
      address:
        deliveryMethod === 'delivery' ? validateAddress(address) : undefined,
    };
    setErrors(next);
    return !hasErrors(next);
  }, [name, phone, email, date, selectedTimeSlot, deliveryMethod, address]);

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const blurValidate = (field: string) => {
    touch(field);
    const validators: Record<string, () => string | undefined> = {
      name: () => validateName(name, 'Full name'),
      phone: () => validatePakistaniPhone(phone),
      email: () => validateEmail(email, false),
      date: () => validateFutureDate(date),
      timeSlot: () => validateTimeSlot(selectedTimeSlot),
      address: () =>
        deliveryMethod === 'delivery' ? validateAddress(address) : undefined,
    };
    setErrors((e) => ({ ...e, [field]: validators[field]?.() }));
  };

  const formIsValid = useMemo(() => {
    const draft = {
      name: validateName(name, 'Full name'),
      phone: validatePakistaniPhone(phone),
      email: validateEmail(email, false),
      date: validateFutureDate(date),
      timeSlot: validateTimeSlot(selectedTimeSlot),
      address:
        deliveryMethod === 'delivery' ? validateAddress(address) : undefined,
    };
    return !hasErrors(draft);
  }, [name, phone, email, date, selectedTimeSlot, deliveryMethod, address]);

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center p-6 bg-[#FFFBF8]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-serif text-[#2C2C2C] mb-4 text-center">Order placed successfully!</h1>
        <p className="text-[#98898D] mb-8 text-center max-w-md">
          You will be contacted via WhatsApp within 12 hours for confirmation and payment details.
        </p>
        <Link href="/" className="px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center p-6 bg-[#FFFBF8]">
        <div className="w-20 h-20 bg-[#F0E8DF] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-[#98898D]" />
        </div>
        <h1 className="text-2xl font-serif text-[#2C2C2C] mb-4">Your cart is empty</h1>
        <p className="text-[#98898D] mb-8 text-center max-w-md">Add some delicious treats to your cart before checking out.</p>
        <Link href="/" className="px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      email: true,
      date: true,
      timeSlot: true,
      address: true,
    });

    if (!validateAll()) {
      setErrorMessage('Please fix the highlighted fields before placing your order.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const cleanName = trimValue(name);
    const cleanPhone = normalizePhoneDigits(phone);
    const cleanEmail = trimValue(email);
    const cleanAddress = trimValue(address);

    try {
      await createOrder({
        customer_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || null,
        delivery_method: deliveryMethod,
        address: deliveryMethod === 'delivery' ? cleanAddress : null,
        date,
        time_slot: selectedTimeSlot,
        items: cart,
        total_amount: totalPrice,
      });

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order creation failed:', err);
      const code = err && typeof err === 'object' && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code === '42501') {
        setErrorMessage(
          'Orders are blocked by database security settings. Run supabase-orders-migration.sql in your Supabase SQL Editor, then try again.'
        );
      } else {
        setErrorMessage('Unable to place order at the moment. Please try again later.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF8]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-[#F0E8DF] rounded-full transition-colors text-[#98898D]">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-10">
            <form id="checkout-form" onSubmit={handlePlaceOrder} noValidate className="space-y-10">
              {errorMessage && (
                <div className="rounded-3xl bg-[#FFE9E6] border border-[#F283AE]/30 px-4 py-3 text-[#B03A2E]">
                  {errorMessage}
                </div>
              )}
              {/* Customer Info */}
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#FAC1B5]/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F283AE]/10 rounded-full flex items-center justify-center text-[#F283AE]">
                    <CheckCircle2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-[#2C2C2C]">Customer Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <ValidatedField label="Full Name" htmlFor="checkout-name" required error={errors.name} touched={touched.name}>
                    <input id="checkout-name" type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => blurValidate('name')} placeholder="e.g. Sarah Khan" aria-invalid={Boolean(touched.name && errors.name)} className={invalidFieldClass(Boolean(touched.name && errors.name), INPUT_CLASS)} />
                  </ValidatedField>
                  <ValidatedField label="Phone Number" htmlFor="checkout-phone" required error={errors.phone} touched={touched.phone}>
                    <input id="checkout-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => blurValidate('phone')} placeholder="e.g. 0300 1234567" aria-invalid={Boolean(touched.phone && errors.phone)} className={invalidFieldClass(Boolean(touched.phone && errors.phone), INPUT_CLASS)} />
                  </ValidatedField>
                  <ValidatedField label="Email Address" htmlFor="checkout-email" error={errors.email} touched={touched.email} className="md:col-span-2">
                    <input id="checkout-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => blurValidate('email')} placeholder="e.g. sarah@example.com" aria-invalid={Boolean(touched.email && errors.email)} className={invalidFieldClass(Boolean(touched.email && errors.email), INPUT_CLASS)} />
                  </ValidatedField>
                </div>
              </section>

              {/* Delivery Method */}
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#FAC1B5]/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#98B8B9]/10 rounded-full flex items-center justify-center text-[#98B8B9]">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-[#2C2C2C]">Delivery Method</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'delivery' ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/20 hover:border-[#F283AE]/30'}`}
                  >
                    <Truck className={deliveryMethod === 'delivery' ? 'text-[#F283AE]' : 'text-[#98898D]'} />
                    <span className={`font-semibold ${deliveryMethod === 'delivery' ? 'text-[#2C2C2C]' : 'text-[#98898D]'}`}>Delivery</span>
                    <span className="text-[10px] text-[#98898D]">Charges Apply</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'pickup' ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/20 hover:border-[#F283AE]/30'}`}
                  >
                    <MapPin className={deliveryMethod === 'pickup' ? 'text-[#F283AE]' : 'text-[#98898D]'} />
                    <span className={`font-semibold ${deliveryMethod === 'pickup' ? 'text-[#2C2C2C]' : 'text-[#98898D]'}`}>Pickup</span>
                    <span className="text-[10px] text-[#98898D]">Free</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {deliveryMethod === 'delivery' ? (
                    <ValidatedField label="Delivery Address" htmlFor="checkout-address" required error={errors.address} touched={touched.address}>
                      <textarea
                        id="checkout-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => blurValidate('address')}
                        placeholder="House #, Street, Area, City"
                        rows={3}
                        aria-invalid={Boolean(touched.address && errors.address)}
                        className={invalidFieldClass(Boolean(touched.address && errors.address), `${INPUT_CLASS} resize-none`)}
                      />
                    </ValidatedField>
                  ) : (
                    <div className="bg-[#F0E8DF]/20 p-4 rounded-xl border border-[#FAC1B5]/30 flex items-start gap-3">
                      <MapPin size={20} className="text-[#F283AE] mt-1" />
                      <div>
                        <p className="font-semibold text-[#2C2C2C]">Pickup Location</p>
                        <p className="text-sm text-[#98898D]">Nawab Town, Lahore, Pakistan</p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <ValidatedField label={`${deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'} Date`} htmlFor="checkout-date" required error={errors.date} touched={touched.date}>
                      <div className="relative">
                        <input id="checkout-date" type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} onBlur={() => blurValidate('date')} aria-invalid={Boolean(touched.date && errors.date)} className={invalidFieldClass(Boolean(touched.date && errors.date), `${INPUT_CLASS} pl-12`)} />
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98898D] pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-[#F283AE] font-medium mt-1">* Orders must be placed at least 48 hours in advance.</p>
                    </ValidatedField>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#2C2C2C]">
                        {deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'} Time Slot <span className="text-[#F283AE]">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedTimeSlot(slot);
                              touch('timeSlot');
                              setErrors((e) => ({ ...e, timeSlot: undefined }));
                            }}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left flex items-center justify-between ${selectedTimeSlot === slot ? 'border-[#F283AE] bg-[#F283AE]/5 text-[#F283AE]' : touched.timeSlot && errors.timeSlot ? 'border-red-500 bg-red-50/40 text-[#98898D]' : 'border-[#FAC1B5]/20 text-[#98898D] hover:border-[#FAC1B5]'}`}
                          >
                            {slot}
                            {selectedTimeSlot === slot && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                      {touched.timeSlot && errors.timeSlot && (
                        <p className="text-sm text-red-600" role="alert">{errors.timeSlot}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-[#FAC1B5]/20 sticky top-28">
              <h2 className="text-xl font-bold text-[#2C2C2C] mb-6">Order Summary</h2>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto mb-6 pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="space-y-2 py-4 border-b border-[#FAC1B5]/10 last:border-0">
                    <div className="flex justify-between gap-4">
                      <p className="font-bold text-[#2C2C2C]">{item.name}</p>
                      <p className="font-bold text-[#F283AE]">Rs. {(item.pricePerItem * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1 text-xs text-[#98898D]">
                      {(item.flavour && item.flavour !== 'None' && !item.cakeFlavour) && (
                        <div className="flex justify-between">
                          <span>Flavour</span>
                          <span className="text-[#2C2C2C] font-medium">{item.flavour}</span>
                        </div>
                      )}
                      {item.cakeFlavour && (
                        <div className="flex justify-between">
                          <span>Cake Flavour</span>
                          <span className="text-[#2C2C2C] font-medium">{item.cakeFlavour}</span>
                        </div>
                      )}
                      {item.cupcakeFlavour && (
                        <div className="flex justify-between">
                          <span>Cupcake Flavour</span>
                          <span className="text-[#2C2C2C] font-medium">{item.cupcakeFlavour}</span>
                        </div>
                      )}
                      {item.shape && (
                        <div className="flex justify-between">
                          <span>Shape</span>
                          <span className="text-[#2C2C2C] font-medium">{item.shape}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Size</span>
                        <span className="text-[#2C2C2C] font-medium">{item.size}</span>
                      </div>
                      
                      {(item.addOns.length > 0 || item.messageOnCake || item.specialInstructions) && (
                        <div className="mt-2 space-y-1">
                          <p className="font-semibold text-[#2C2C2C] text-[10px] uppercase tracking-wider">Customizations</p>
                          {item.addOns.length > 0 && (
                            <div className="flex justify-between">
                              <span>Add-ons</span>
                              <span className="text-[#2C2C2C] text-right">{item.addOns.map(a => a.replace(/\s*\(.*?\)/g, '')).join(', ')}</span>
                            </div>
                          )}
                          {item.messageOnCake && (
                            <div className="flex justify-between">
                              <span>Message</span>
                              <span className="text-[#2C2C2C] italic">&quot;{item.messageOnCake}&quot;</span>
                            </div>
                          )}
                          {item.theme && (
                            <div className="flex justify-between">
                              <span>Theme</span>
                              <span className="text-[#2C2C2C]">{item.theme}</span>
                            </div>
                          )}
                          {item.colorPreferences && (
                            <div className="flex justify-between">
                              <span>Colors</span>
                              <span className="text-[#2C2C2C]">{item.colorPreferences}</span>
                            </div>
                          )}
                          {item.referenceImage && (
                            <div className="flex justify-between">
                              <span>Reference</span>
                              <span className="text-[#2C2C2C] line-clamp-1">{item.referenceImage}</span>
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div className="flex justify-between">
                              <span>Instructions</span>
                              <span className="text-[#2C2C2C] text-right">{item.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-2 pt-2 border-t border-[#FAC1B5]/5">
                        <span>Quantity</span>
                        <span className="text-[#2C2C2C] font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Item Price</span>
                        <span className="text-[#2C2C2C] font-medium">Rs. {item.pricePerItem.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-[#FAC1B5]/20">
                <div className="flex justify-between text-sm text-[#98898D]">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[#98898D]">
                  <span>Delivery</span>
                  <span className="text-[#98B8B9] font-medium">{deliveryMethod === 'delivery' ? 'Calculated later' : 'Free'}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#FAC1B5]/20">
                  <span className="font-bold text-[#2C2C2C]">Total</span>
                  <span className="text-2xl font-bold text-[#F283AE]">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isSubmitting || !formIsValid}
                className="w-full py-4 bg-[#F283AE] text-white rounded-full font-bold shadow-lg hover:bg-[#E86FA3] transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Placing order...' : 'Place Order'}
              </button>
              
              <p className="text-[10px] text-center text-[#98898D] mt-4 leading-relaxed">
                By placing your order, you agree to our Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
