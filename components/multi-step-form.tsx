'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Upload, Check } from 'lucide-react';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import {
  trimValue,
  normalizePhoneDigits,
  hasErrors,
} from '@/lib/validation';
import {
  validateMultiStepStep,
  validateEntireMultiStepForm,
  stepIsValid,
  type MultiStepFormData,
} from '@/lib/multi-step-validation';
import { createOrder, supabase } from '@/lib/supabase';

const INPUT_CLASS =
  'w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors';

// Exact flavours from requirements
const FLAVOURS = [
  'French Vanilla',
  'Celestial Caramel',
  'Cherry Chocolate Fantasy',
  'Chocolate Amour',
  'Nutella Caramel'
];

// Cake sizes
const CAKE_SIZES = ['1 lb', '2 lb', '3 lb', '4 lb', '5 lb'];

// Cupcake sizes
const CUPCAKE_SIZES = [
  { label: 'Box of 6', value: '6' },
];

// Cake shapes
const CAKE_SHAPES = ['Heart', 'Round', 'Square'];

// Time slots from requirements (9:00 AM - 9:00 PM)
const TIME_SLOTS = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
];

// Add-ons with exact prices from requirements
const ADD_ONS = [
  { id: 'message-card', label: 'Custom Message Card (Printed / Handwritten)', price: 150 },
  { id: 'candles', label: 'Extra Candles (Themed / Plain)', price: 30 },
  { id: 'topper', label: 'Cake Topper (Happy Birthday, Eid, Love)', price: 250 },
  { id: 'balloon', label: 'Helium Balloon', price: 200 },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Customer Details
    name: '',
    phone: '',
    email: '',
    // Step 2: Order Type
    orderType: 'cake' as 'cake' | 'cupcakes',
    // Step 3: Product Details
    flavour: '',
    size: '2 lb',
    cupcakeSize: '6',
    shape: 'Round',
    // Step 4: Customization
    theme: '',
    colorPreferences: '',
    addOns: [] as string[],
    messageOnCake: '',
    referenceImage: null as File | null,
    specialInstructions: '',
    // Step 5: Delivery/Pickup
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    address: '',
    date: '',
    timeSlot: '',
    // Step 6: Confirmation
    termsAccepted: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState('');

  const minDate = useMemo(
    () => new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    []
  );

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const blurValidate = useCallback(
    (field: string) => {
      touch(field);
      const stepErrors = validateMultiStepStep(step, formData as MultiStepFormData);
      setErrors((e) => ({ ...e, [field]: stepErrors[field] }));
    },
    [step, formData]
  );

  const validateCurrentStep = useCallback(() => {
    const next = validateMultiStepStep(step, formData as MultiStepFormData);
    setErrors((e) => ({ ...e, ...next }));
    const fields = Object.keys(next);
    setTouched((t) => ({
      ...t,
      ...fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}),
    }));
    return !hasErrors(next);
  }, [step, formData]);

  const currentStepValid = useMemo(
    () => stepIsValid(step, formData as MultiStepFormData),
    [step, formData]
  );

  const fieldInvalid = (field: string) => Boolean(touched[field] && errors[field]);

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setFormError('Please fix the highlighted fields before continuing.');
      return;
    }
    setFormError('');
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddOnChange = (addOnId: string) => {
    const newAddOns = formData.addOns.includes(addOnId)
      ? formData.addOns.filter(a => a !== addOnId)
      : [...formData.addOns, addOnId];
    setFormData({ ...formData, addOns: newAddOns });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, referenceImage: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateEntireMultiStepForm(formData as MultiStepFormData);
    setErrors(allErrors);
    setTouched(
      Object.keys(allErrors).reduce((acc, f) => ({ ...acc, [f]: true }), {} as Record<string, boolean>)
    );
    if (hasErrors(allErrors)) {
      setFormError('Please fix all highlighted fields before placing your order.');
      const firstBadStep = [1, 3, 5, 6].find((s) => !stepIsValid(s, formData as MultiStepFormData));
      if (firstBadStep) setStep(firstBadStep);
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    const cleanName = trimValue(formData.name);
    const cleanPhone = normalizePhoneDigits(formData.phone);
    const cleanEmail = trimValue(formData.email);
    const cleanAddress = trimValue(formData.address);

    try {
      let referenceImageUrl = null;
      if (formData.referenceImage) {
        const fileExt = formData.referenceImage.name.split('.').pop() || 'jpg';
        const fileName = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`custom-orders/${fileName}`, formData.referenceImage, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Image upload failed:', uploadError);
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(uploadData.path);
          referenceImageUrl = publicUrl;
        }
      }

      await createOrder({
        customer_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || null,
        delivery_method: formData.deliveryType,
        address: formData.deliveryType === 'delivery' ? cleanAddress : null,
        date: formData.date,
        time_slot: formData.timeSlot,
        items: [
          {
            id: `custom-${Date.now()}`,
            name: `Custom ${formData.orderType === 'cake' ? 'Cake' : 'Cupcakes'}`,
            category: 'Custom',
            size: formData.orderType === 'cake' ? formData.size : `Box of ${formData.cupcakeSize}`,
            flavour: formData.flavour,
            shape: formData.orderType === 'cake' ? formData.shape : undefined,
            addOns: formData.addOns.map(id => ADD_ONS.find(a => a.id === id)?.label || id),
            messageOnCake: trimValue(formData.messageOnCake),
            theme: trimValue(formData.theme),
            colorPreferences: trimValue(formData.colorPreferences),
            referenceImage: referenceImageUrl || undefined,
            specialInstructions: trimValue(formData.specialInstructions),
            quantity: 1,
            pricePerItem: 0,
          }
        ],
        total_amount: 0,
      });

      setFormData({
        ...formData,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        address: cleanAddress,
        theme: trimValue(formData.theme),
        colorPreferences: trimValue(formData.colorPreferences),
        messageOnCake: trimValue(formData.messageOnCake),
        specialInstructions: trimValue(formData.specialInstructions),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Order creation failed:', err);
      const code = err && typeof err === 'object' && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code === '42501') {
        setFormError('Orders are blocked by database security settings.');
      } else {
        setFormError('Unable to place order at the moment. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsSubmitted(false);
    setFormData({
      name: '', phone: '', email: '', orderType: 'cake', flavour: '', size: '2 lb',
      cupcakeSize: '6', shape: 'Round', theme: '', colorPreferences: '', addOns: [],
      messageOnCake: '', referenceImage: null, specialInstructions: '',
      deliveryType: 'delivery', address: '', date: '', timeSlot: '', termsAccepted: false,
    });
    setImagePreview(null);
    setTouched({});
    setErrors({});
    setFormError('');
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#98B8B9] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-[#98898D] mb-8">
            We&apos;ll contact you on WhatsApp within 12 hours for confirmation and payment details.
          </p>
          <div className="bg-[#F0E8DF]/30 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-[#2C2C2C] mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-[#98898D]">Name:</span> <span className="font-medium">{formData.name}</span></p>
              <p><span className="text-[#98898D]">Phone:</span> <span className="font-medium">{formData.phone}</span></p>
              <p><span className="text-[#98898D]">Order Type:</span> <span className="font-medium capitalize">{formData.orderType}</span></p>
              <p><span className="text-[#98898D]">Flavour:</span> <span className="font-medium">{formData.flavour}</span></p>
              <p><span className="text-[#98898D]">{formData.orderType === 'cake' ? 'Size' : 'Quantity'}:</span> <span className="font-medium">{formData.orderType === 'cake' ? formData.size : `Box of ${formData.cupcakeSize}`}</span></p>
              <p><span className="text-[#98898D]">Delivery Method:</span> <span className="font-medium capitalize">{formData.deliveryType}</span></p>
              <p><span className="text-[#98898D]">Date:</span> <span className="font-medium">{formData.date}</span></p>
              <p><span className="text-[#98898D]">Time:</span> <span className="font-medium">{formData.timeSlot}</span></p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetForm}
              className="px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors"
            >
              Place Another Order
            </button>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-[#FAC1B5] text-[#2C2C2C] rounded-full font-semibold hover:bg-[#F0E8DF] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 md:px-12 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-[#F283AE] font-medium mb-2">
            Please read our{' '}
            <Link href="/terms" className="underline hover:text-[#E86FA3]">
              Terms & Conditions
            </Link>{' '}
            before filling out this custom order form.
          </p>
          <h1 className="text-4xl font-serif text-[#2C2C2C] mb-2">Custom Order Form</h1>
          <p className="text-[#98898D]">Step {step} of 6</p>
          
          {/* Progress Bar */}
          <div className="mt-6 h-2 bg-[#F0E8DF] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F283AE] to-[#C59FBE] transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="mt-4 flex justify-between text-xs text-[#98898D]">
            <span className={step >= 1 ? 'text-[#F283AE] font-medium' : ''}>Details</span>
            <span className={step >= 2 ? 'text-[#F283AE] font-medium' : ''}>Type</span>
            <span className={step >= 3 ? 'text-[#F283AE] font-medium' : ''}>Product</span>
            <span className={step >= 4 ? 'text-[#F283AE] font-medium' : ''}>Custom</span>
            <span className={step >= 5 ? 'text-[#F283AE] font-medium' : ''}>Delivery</span>
            <span className={step >= 6 ? 'text-[#F283AE] font-medium' : ''}>Confirm</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Step 1: Customer Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Customer Details</h2>
              <ValidatedField label="Name" htmlFor="order-name" required error={errors.name} touched={touched.name}>
                <input
                  id="order-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => blurValidate('name')}
                  placeholder="Your full name"
                  aria-invalid={fieldInvalid('name')}
                  className={invalidFieldClass(fieldInvalid('name'), INPUT_CLASS)}
                />
              </ValidatedField>
              <ValidatedField label="Phone Number" htmlFor="order-phone" required error={errors.phone} touched={touched.phone}>
                <input
                  id="order-phone"
                  type="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => blurValidate('phone')}
                  placeholder="03XX XXXXXXX"
                  aria-invalid={fieldInvalid('phone')}
                  className={invalidFieldClass(fieldInvalid('phone'), INPUT_CLASS)}
                />
              </ValidatedField>
              <ValidatedField label="Email Address" htmlFor="order-email" error={errors.email} touched={touched.email}>
                <input
                  id="order-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => blurValidate('email')}
                  placeholder="your@email.com"
                  aria-invalid={fieldInvalid('email')}
                  className={invalidFieldClass(fieldInvalid('email'), INPUT_CLASS)}
                />
              </ValidatedField>
            </div>
          )}

          {/* Step 2: Order Type */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Select Product Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.orderType === 'cake'
                      ? 'border-[#F283AE] bg-[#F283AE]/10'
                      : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                  }`}
                >
                  <input
                    type="radio"
                    value="cake"
                    checked={formData.orderType === 'cake'}
                    onChange={(e) => handleInputChange('orderType', e.target.value)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#FAC1B5]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🎂</span>
                    </div>
                    <p className="font-semibold text-[#2C2C2C]">Cake</p>
                    <p className="text-sm text-[#98898D] mt-1">Custom cakes in various sizes</p>
                  </div>
                </label>
                <label
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.orderType === 'cupcakes'
                      ? 'border-[#F283AE] bg-[#F283AE]/10'
                      : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                  }`}
                >
                  <input
                    type="radio"
                    value="cupcakes"
                    checked={formData.orderType === 'cupcakes'}
                    onChange={(e) => handleInputChange('orderType', e.target.value)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#C59FBE]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🧁</span>
                    </div>
                    <p className="font-semibold text-[#2C2C2C]">Cupcakes</p>
                    <p className="text-sm text-[#98898D] mt-1">Box of 6 cupcakes</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Product Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">
                {formData.orderType === 'cake' ? 'Cake' : 'Cupcake'} Details
              </h2>
              
              {/* Flavour */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Flavour <span className="text-[#F283AE]">*</span></label>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${fieldInvalid('flavour') ? 'rounded-xl ring-2 ring-red-500/30 p-1' : ''}`}>
                  {FLAVOURS.map((flavour) => (
                    <label
                      key={flavour}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.flavour === flavour
                          ? 'border-[#F283AE] bg-[#F283AE]/10'
                          : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                      }`}
                    >
                      <input
                        type="radio"
                        value={flavour}
                        checked={formData.flavour === flavour}
                        onChange={(e) => { handleInputChange('flavour', e.target.value); touch('flavour'); setErrors((er) => ({ ...er, flavour: undefined })); }}
                        className="hidden"
                      />
                      <p className="font-medium text-[#2C2C2C]">{flavour}</p>
                    </label>
                  ))}
                </div>
                {touched.flavour && errors.flavour && (
                  <p className="text-sm text-red-600 mt-2" role="alert">{errors.flavour}</p>
                )}
              </div>

              {/* Size - Different for Cake vs Cupcakes */}
              {formData.orderType === 'cake' ? (
                <div>
                  <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Size *</label>
                  <div className="flex flex-wrap gap-3">
                    {CAKE_SIZES.map((size) => (
                      <label
                        key={size}
                        className={`px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.size === size
                            ? 'border-[#F283AE] bg-[#F283AE]/10'
                            : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                        }`}
                      >
                        <input
                          type="radio"
                          value={size}
                          checked={formData.size === size}
                          onChange={(e) => handleInputChange('size', e.target.value)}
                          className="hidden"
                        />
                        <p className="font-semibold text-[#2C2C2C]">{size}</p>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Quantity *</label>
                  <div className="flex flex-wrap gap-3">
                    {CUPCAKE_SIZES.map((size) => (
                      <label
                        key={size.value}
                        className={`px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.cupcakeSize === size.value
                            ? 'border-[#F283AE] bg-[#F283AE]/10'
                            : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                        }`}
                      >
                        <input
                          type="radio"
                          value={size.value}
                          checked={formData.cupcakeSize === size.value}
                          onChange={(e) => handleInputChange('cupcakeSize', e.target.value)}
                          className="hidden"
                        />
                        <p className="font-semibold text-[#2C2C2C]">{size.label}</p>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Shape - Only for Cakes */}
              {formData.orderType === 'cake' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Shape *</label>
                  <div className="flex flex-wrap gap-3">
                    {CAKE_SHAPES.map((shape) => (
                      <label
                        key={shape}
                        className={`px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.shape === shape
                            ? 'border-[#F283AE] bg-[#F283AE]/10'
                            : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                        }`}
                      >
                        <input
                          type="radio"
                          value={shape}
                          checked={formData.shape === shape}
                          onChange={(e) => handleInputChange('shape', e.target.value)}
                          className="hidden"
                        />
                        <p className="font-semibold text-[#2C2C2C]">{shape}</p>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Customization */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Customization Details</h2>
              
              {/* Theme */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Theme</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  placeholder="e.g., Birthday, Wedding, Baby Shower, Eid"
                  className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors"
                />
              </div>

              {/* Color Preferences */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Color Preferences</label>
                <input
                  type="text"
                  value={formData.colorPreferences}
                  onChange={(e) => handleInputChange('colorPreferences', e.target.value)}
                  placeholder="e.g., Pink and white, gold accents"
                  className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors"
                />
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Add-ons (Optional)</label>
                <div className="space-y-3">
                  {ADD_ONS.map((addOn) => (
                    <label
                      key={addOn.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.addOns.includes(addOn.id)
                          ? 'border-[#F283AE] bg-[#F283AE]/10'
                          : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.addOns.includes(addOn.id)}
                          onChange={() => handleAddOnChange(addOn.id)}
                          className="w-5 h-5 rounded border-[#FAC1B5] accent-[#F283AE]"
                        />
                        <span className="text-[#2C2C2C]">{addOn.label}</span>
                      </div>
                      {/* Price removed for custom orders */}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message on Cake/Cupcake */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
                  Message on {formData.orderType === 'cake' ? 'Cake' : 'Cupcake'}
                </label>
                <input
                  type="text"
                  value={formData.messageOnCake}
                  onChange={(e) => handleInputChange('messageOnCake', e.target.value)}
                  placeholder="e.g., Happy Birthday Sarah!"
                  className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors"
                />
              </div>

              {/* Reference Image */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Reference Image</label>
                <div className="border-2 border-dashed border-[#FAC1B5]/30 rounded-xl p-6 text-center hover:border-[#F283AE] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="Preview" className="h-40 mx-auto mb-3 rounded-lg object-cover" />
                        <p className="text-sm text-[#98898D]">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto text-[#F283AE] mb-3" />
                        <p className="text-[#2C2C2C] font-medium">Click to upload reference image</p>
                        <p className="text-sm text-[#98898D] mt-1">JPG, PNG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Special Instructions</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any additional details or requests..."
                  className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors resize-none h-24"
                />
              </div>
            </div>
          )}

          {/* Step 5: Delivery/Pickup */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Delivery / Pickup Details</h2>
              
              {/* Delivery Type */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Order Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.deliveryType === 'delivery'
                        ? 'border-[#F283AE] bg-[#F283AE]/10'
                        : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="delivery"
                      checked={formData.deliveryType === 'delivery'}
                      onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                      className="hidden"
                    />
                    <div className="text-center">
                      <p className="text-2xl mb-2">🚚</p>
                      <p className="font-semibold text-[#2C2C2C]">Delivery</p>
                      <p className="text-xs text-[#98898D] mt-1">(Charges Apply)</p>
                    </div>
                  </label>
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.deliveryType === 'pickup'
                        ? 'border-[#F283AE] bg-[#F283AE]/10'
                        : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                      className="hidden"
                    />
                    <div className="text-center">
                      <p className="text-2xl mb-2">📍</p>
                      <p className="font-semibold text-[#2C2C2C]">Pickup</p>
                      <p className="text-xs text-[#98898D] mt-1">(Free)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery Address (only if delivery selected) */}
              {formData.deliveryType === 'delivery' && (
                <ValidatedField label="Delivery Address" htmlFor="order-address" required error={errors.address} touched={touched.address}>
                  <textarea
                    id="order-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => blurValidate('address')}
                    placeholder="Complete delivery address"
                    rows={4}
                    aria-invalid={fieldInvalid('address')}
                    className={invalidFieldClass(fieldInvalid('address'), `${INPUT_CLASS} resize-none`)}
                  />
                </ValidatedField>
              )}

              {/* Pickup Location (only if pickup selected) */}
              {formData.deliveryType === 'pickup' && (
                <div className="bg-[#98B8B9]/10 p-5 rounded-xl border border-[#98B8B9]/30">
                  <p className="font-semibold text-[#2C2C2C] mb-1">Pickup Location</p>
                  <p className="text-[#98898D]">Nawab Town, Lahore, Pakistan</p>
                </div>
              )}

              <ValidatedField
                label={`${formData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Date`}
                htmlFor="order-date"
                required
                error={errors.date}
                touched={touched.date}
              >
                <input
                  id="order-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  onBlur={() => blurValidate('date')}
                  min={minDate}
                  aria-invalid={fieldInvalid('date')}
                  className={invalidFieldClass(fieldInvalid('date'), INPUT_CLASS)}
                />
                <p className="text-xs text-[#98898D] mt-2">Orders must be placed at least 48 hours in advance.</p>
              </ValidatedField>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                  {formData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Time <span className="text-[#F283AE]">*</span>
                </label>
                <div className={`grid grid-cols-2 gap-3 ${fieldInvalid('timeSlot') ? 'rounded-xl ring-2 ring-red-500/30 p-1' : ''}`}>
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        formData.timeSlot === slot
                          ? 'border-[#F283AE] bg-[#F283AE]/10'
                          : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'
                      }`}
                    >
                      <input
                        type="radio"
                        value={slot}
                        checked={formData.timeSlot === slot}
                        onChange={(e) => { handleInputChange('timeSlot', e.target.value); touch('timeSlot'); setErrors((er) => ({ ...er, timeSlot: undefined })); }}
                        className="hidden"
                      />
                      <p className="font-medium text-[#2C2C2C] text-sm">{slot}</p>
                    </label>
                  ))}
                </div>
                {touched.timeSlot && errors.timeSlot && (
                  <p className="text-sm text-red-600 mt-2" role="alert">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Summary & Confirmation */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Order Summary & Confirmation</h2>
              
              {/* Order Summary */}
              <div className="bg-[#F0E8DF]/30 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#98898D]">Customer</p>
                    <p className="font-semibold text-[#2C2C2C]">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-[#98898D]">Phone</p>
                    <p className="font-semibold text-[#2C2C2C]">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-[#98898D]">Order Type</p>
                    <p className="font-semibold text-[#2C2C2C] capitalize">{formData.orderType}</p>
                  </div>
                  <div>
                    <p className="text-[#98898D]">Flavour</p>
                    <p className="font-semibold text-[#2C2C2C]">{formData.flavour}</p>
                  </div>
                  <div>
                    <p className="text-[#98898D]">{formData.orderType === 'cake' ? 'Size' : 'Quantity'}</p>
                    <p className="font-semibold text-[#2C2C2C]">
                      {formData.orderType === 'cake' ? formData.size : `Box of ${formData.cupcakeSize}`}
                    </p>
                  </div>
                  {formData.orderType === 'cake' && (
                    <div>
                      <p className="text-[#98898D]">Shape</p>
                      <p className="font-semibold text-[#2C2C2C]">{formData.shape}</p>
                    </div>
                  )}
                  {formData.theme && (
                    <div>
                      <p className="text-[#98898D]">Theme</p>
                      <p className="font-semibold text-[#2C2C2C]">{formData.theme}</p>
                    </div>
                  )}
                  {formData.messageOnCake && (
                    <div className="col-span-2">
                      <p className="text-[#98898D]">Message</p>
                      <p className="font-semibold text-[#2C2C2C]">{formData.messageOnCake}</p>
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                {formData.addOns.length > 0 && (
                  <div className="border-t border-[#FAC1B5]/30 pt-4">
                    <p className="text-[#98898D] mb-2">Add-ons</p>
                    <div className="space-y-1">
                      {formData.addOns.map((addOnId) => {
                        const addOn = ADD_ONS.find(a => a.id === addOnId);
                        return addOn ? (
                          <div key={addOnId} className="flex justify-between text-sm">
                            <span className="text-[#2C2C2C]">{addOn.label}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Details */}
                <div className="border-t border-[#FAC1B5]/30 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#98898D]">Method</p>
                      <p className="font-semibold text-[#2C2C2C] capitalize">{formData.deliveryType}</p>
                    </div>
                    <div>
                      <p className="text-[#98898D]">Date</p>
                      <p className="font-semibold text-[#2C2C2C]">{formData.date}</p>
                    </div>
                    <div>
                      <p className="text-[#98898D]">Time</p>
                      <p className="font-semibold text-[#2C2C2C]">{formData.timeSlot}</p>
                    </div>
                    {formData.deliveryType === 'delivery' && formData.address && (
                      <div className="col-span-2">
                        <p className="text-[#98898D]">Address</p>
                        <p className="font-semibold text-[#2C2C2C]">{formData.address}</p>
                      </div>
                    )}
                    {formData.deliveryType === 'pickup' && (
                      <div className="col-span-2">
                        <p className="text-[#98898D]">Pickup Location</p>
                        <p className="font-semibold text-[#2C2C2C]">Nawab Town, Lahore</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-[#C59FBE]/10 p-4 rounded-xl border border-[#C59FBE]/30">
                <p className="text-sm text-[#2C2C2C]">
                  <span className="font-semibold">Note:</span> Orders must be placed at least 48 hours in advance. You will receive a WhatsApp confirmation within 12 hours with payment details and final confirmation.
                </p>
              </div>

              {/* Terms Checkbox */}
              <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-colors ${fieldInvalid('termsAccepted') ? 'border-red-500 bg-red-50/40' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    handleInputChange('termsAccepted', e.target.checked);
                    touch('termsAccepted');
                    if (e.target.checked) setErrors((er) => ({ ...er, termsAccepted: undefined }));
                  }}
                  className="w-5 h-5 mt-0.5 rounded border-[#FAC1B5] accent-[#F283AE]"
                />
                <span className="text-sm text-[#2C2C2C]">
                  I confirm that I have read and agree to the{' '}
                  <Link href="/terms" className="text-[#F283AE] underline hover:text-[#E86FA3]" target="_blank">
                    Terms & Conditions
                  </Link>.
                </span>
              </label>
              {touched.termsAccepted && errors.termsAccepted && (
                <p className="text-sm text-red-600" role="alert">{errors.termsAccepted}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#FAC1B5] text-[#2C2C2C] rounded-full font-semibold hover:bg-[#F0E8DF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentStepValid}
                className="flex items-center gap-2 px-6 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!currentStepValid || isSubmitting}
                className="ml-auto px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
