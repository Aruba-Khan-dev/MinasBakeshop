'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Plus, Minus, ShoppingBag, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import { FLAVOURS, ADD_ONS, CAKE_SHAPES } from '@/lib/products';

const categoryColors: Record<string, string> = {
  'vintage-cakes': '#C59FBE', 'wedding-cakes': '#C59FBE', 'baby-cakes': '#98B8B9',
  'fresh-flower-cakes': '#F283AE', 'valentines-day-cakes': '#F283AE', 'eid-cakes': '#C6C870',
  'mothers-day-cakes': '#F283AE', 'anniversary-cakes': '#FAC1B5', 'default': '#F283AE',
};

import { useCart } from '@/context/cart-context';

export default function ProductDetailPage({ params }: { params: Promise<{ category: string; product: string }> }) {
  const { category, product: productId } = use(params);
  const accentColor = categoryColors[category] || categoryColors['default'];

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<{ size_label: string; price: number } | null>(null);
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [selectedCakeFlavour, setSelectedCakeFlavour] = useState('');
  const [selectedCupcakeFlavour, setSelectedCupcakeFlavour] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('');
  const [colorPreferences, setColorPreferences] = useState('');
  const [referenceImage, setReferenceImage] = useState('');
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [uploading, setUploading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const toSlug = (name: string | undefined) =>
    name
      ?.toString()
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[\\/&]/g, ' ')
      .replace(/[^a-z0-9\\s-]/g, '')
      .trim()
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-') || '';

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Try to find by id (numeric)
        const id = parseInt(productId);
        if (!isNaN(id)) {
          const { data, error } = await supabase.from('products').select('*, product_sizes(*)').eq('id', id).single();
          if (!error && data) {
            setProduct(data);
            if (data.product_sizes?.length > 0) setSelectedSize(data.product_sizes[0]);
            return;
          }
        }
        // Fallback: try by name match
        const name = productId.replace(/-/g, ' ');
        const { data } = await supabase.from('products').select('*, product_sizes(*)').ilike('name', `%${name}%`).limit(1).single();
        if (data) {
          setProduct(data);
          if (data.product_sizes?.length > 0) setSelectedSize(data.product_sizes[0]);
        }
      } catch (err) {
        console.error('Product not found:', err);
      } finally { setLoading(false); }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#F283AE]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 px-6 md:px-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Product Not Found</h1>
          <p className="text-[#98898D] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="px-6 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3]">Back to Home</Link>
        </div>
      </div>
    );
  }

  const sizes = product.product_sizes || [];
  const currentPrice = selectedSize?.price || sizes[0]?.price || 0;
  const addOnsTotal = selectedAddOns.reduce((total, id) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = (currentPrice + addOnsTotal) * quantity;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    let finalReferenceImage = referenceImage;

    if (referenceImageFile) {
      setUploading(true);
      try {
        const fileExt = referenceImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `reference-images/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, referenceImageFile);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalReferenceImage = publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        finalReferenceImage = "Image uploaded (see WhatsApp)";
      } finally {
        setUploading(false);
      }
    }

    const addOnLabels = selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.label).filter(Boolean) as string[];

    addItem({
      id: String(product.id),
      name: product.name,
      category: product.category,
      size: product.category?.toLowerCase().includes('bento') || product.category?.toLowerCase().includes('hampers') || product.category?.toLowerCase().includes('gift boxes') ? 'Standard' : (selectedSize?.size_label || 'Default'),
      flavour: selectedFlavour || 'None',
      cakeFlavour: selectedCakeFlavour || undefined,
      cupcakeFlavour: selectedCupcakeFlavour || undefined,
      shape: selectedShape || undefined,
      addOns: addOnLabels,
      messageOnCake: message,
      theme,
      colorPreferences,
      referenceImage: finalReferenceImage,
      specialInstructions: specialInstructions,
      quantity: product.category?.toLowerCase().includes('bento') || product.category?.toLowerCase().includes('hampers') || product.category?.toLowerCase().includes('gift boxes') ? 1 : quantity,
      pricePerItem: (selectedSize?.price || 0) + selectedAddOns.reduce((total, id) => total + (ADD_ONS.find(a => a.id === id)?.price || 0), 0),
      image: product.image_url || undefined
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-[#FFFBF8]">
      <div className="px-4 md:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-[#98898D] flex-wrap">
          <Link href="/" className="hover:text-[#F283AE]">Home</Link>
          <span>/</span>
          <Link href={`/shop/${category}`} className="hover:text-[#F283AE]">{product.category || category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</Link>
          <span>/</span>
          <span className="text-[#2C2C2C] font-medium">{product.name}</span>
        </div>
      </div>

      <section className="px-4 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}15` }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <span className="text-8xl block mb-4">🎂</span>
                      <p className="text-[#98898D] text-sm font-medium">Custom Design</p>
                    </div>
                  )}
                </div>
                {/* price overlay removed per request */}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-2">{product.name}</h1>
                <p className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                  Rs. {(selectedSize?.price || sizes[0]?.price || 0).toLocaleString()}
                </p>
                {(product.category?.toLowerCase().includes('hamper') || product.category?.toLowerCase().includes('gift box') || product.category?.toLowerCase().includes('hampers') || product.category?.toLowerCase().includes('gift boxes')) && product.description && (
                  <p className="text-[#98898D] text-lg whitespace-pre-wrap">{product.description}</p>
                )}
              </div>

              <hr className="border-[#FAC1B5]/30" />

              {/* Sizes */}
              {sizes.length > 0 &&
                !product.category?.toLowerCase().includes('bento') &&
                !product.category?.toLowerCase().includes('hampers') &&
                !product.category?.toLowerCase().includes('gift boxes') &&
                product.category?.toLowerCase() !== 'loaf cakes' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Select Size *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {sizes.map((size) => (
                        <button key={size.id || size.size_label} onClick={() => setSelectedSize(size)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${selectedSize?.size_label === size.size_label ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                          <p className="font-semibold text-[#2C2C2C]">{size.size_label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}



              {/* Flavour Selection (Standard) */}
              {product.category?.toLowerCase() !== 'loaf cakes' &&
                product.category?.toLowerCase() !== 'brownies' &&
                product.category?.toLowerCase() !== 'cookies' &&
                !product.category?.toLowerCase().includes('cupcake bento') &&
                !product.category?.toLowerCase().includes('hampers') &&
                !product.category?.toLowerCase().includes('gift boxes') &&
                !product.category?.toLowerCase().includes('flower box') && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Select Flavour *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {FLAVOURS.map((f) => (
                        <button key={f} onClick={() => setSelectedFlavour(f)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${selectedFlavour === f ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                          <p className="font-medium text-[#2C2C2C] text-sm">{f}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Single Flavour Selection for Bento Flower Box and Sunshine Hamper */}
              {(product.category?.toLowerCase().includes('flower box') ||
                product.name === 'The Sunshine Hamper') && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Flavor *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {FLAVOURS.map((flavour) => (
                        <button key={flavour} onClick={() => setSelectedFlavour(flavour)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${selectedFlavour === flavour ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                          <p className="font-medium text-[#2C2C2C] text-sm">{flavour}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Cake & Cupcake Flavour Selection (for Cupcake Bento Boxes and Hampers) */}
              {(product.category?.toLowerCase().includes('cupcake bento') ||
                product.category?.toLowerCase().includes('hampers') ||
                product.category?.toLowerCase().includes('gift boxes')) &&
                product.name !== 'The Sunshine Hamper' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Flavor (Cake) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {FLAVOURS.map((flavour) => (
                          <button key={flavour} onClick={() => setSelectedCakeFlavour(flavour)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedCakeFlavour === flavour ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                            <p className="font-medium text-[#2C2C2C] text-sm">{flavour}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Flavour (Cupcake) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {FLAVOURS.map((flavour) => (
                          <button key={flavour} onClick={() => setSelectedCupcakeFlavour(flavour)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedCupcakeFlavour === flavour ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                            <p className="font-medium text-[#2C2C2C] text-sm">{flavour}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Shape Selection (for Bento Boxes and Hampers) */}
              {(product.category?.toLowerCase().includes('flower box') ||
                product.category?.toLowerCase().includes('cupcake bento') ||
                product.category?.toLowerCase().includes('hampers') ||
                product.category?.toLowerCase().includes('gift boxes')) && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                      {product.name === 'The Sunshine Hamper' ? 'Shape' : 'Shape(Cake)'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Heart', 'Round', 'Square'].map((shape) => (
                        <button key={shape} onClick={() => setSelectedShape(shape)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${selectedShape === shape ? 'border-[#F283AE] bg-[#F283AE]/5 shadow-sm' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                          <p className="font-medium text-[#2C2C2C] text-sm">{shape}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Message */}
              {product.category?.toLowerCase() !== 'loaf cakes' && product.category?.toLowerCase() !== 'cookies' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                    {product.category === 'Cupcakes'
                      ? 'Message on Cupcake'
                      : product.category === 'Brownies'
                        ? 'Message on Brownies'
                        : 'Message on Cake'} <span className="text-[#98898D] font-normal">(Optional)</span>
                  </label>
                  <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Happy Birthday Sarah!"
                    className="w-full px-4 py-3 border-2 border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE]" />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Special Instructions <span className="text-[#98898D] font-normal">(Optional)</span></label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any specific requests or dietary notes..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] resize-none"
                />
              </div>

              {/* Add-ons */}
              {product.category?.toLowerCase() !== 'loaf cakes' && product.category?.toLowerCase() !== 'cookies' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Add-ons <span className="text-[#98898D] font-normal">(Optional)</span></label>
                  <div className="space-y-2">
                    {ADD_ONS.map((addOn) => (
                      <label key={addOn.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddOns.includes(addOn.id) ? 'border-[#F283AE] bg-[#F283AE]/5' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={selectedAddOns.includes(addOn.id)}
                            onChange={(e) => { if (e.target.checked) setSelectedAddOns([...selectedAddOns, addOn.id]); else setSelectedAddOns(selectedAddOns.filter(id => id !== addOn.id)); }}
                            className="w-5 h-5 rounded accent-[#F283AE]" />
                          <span className="text-sm text-[#2C2C2C]">{addOn.label}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: accentColor }}>Rs. {addOn.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Theme & Color Preferences (for Bento Boxes and Gift Boxes) */}
              {(product.category?.toLowerCase().includes('flower box') ||
                product.category?.toLowerCase().includes('cupcake bento') ||
                product.category?.toLowerCase().includes('luxury') ||
                product.category?.toLowerCase().includes('hampers') ||
                product.category?.toLowerCase().includes('gift boxes')) && (
                  <>
                    <div>
                      <label htmlFor="theme" className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                        Theme <span className="text-[#98898D] font-normal">(e.g. Birthday, Anniversary)</span>
                      </label>
                      <input
                        id="theme"
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="e.g. Minimalist, Floral, etc."
                        className="w-full px-4 py-3 border-2 border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE]"
                      />
                    </div>
                    <div>
                      <label htmlFor="colorPreferences" className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                        Color Preferences
                      </label>
                      <input
                        id="colorPreferences"
                        type="text"
                        value={colorPreferences}
                        onChange={(e) => setColorPreferences(e.target.value)}
                        placeholder="e.g. Pastel Pink and Gold"
                        className="w-full px-4 py-3 border-2 border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE]"
                      />
                    </div>
                  </>
                )}

              {/* Reference Image */}
              {(product.category?.toLowerCase().includes('flower box') ||
                product.category?.toLowerCase().includes('cupcake bento') ||
                product.category?.toLowerCase().includes('hampers') ||
                product.category?.toLowerCase().includes('gift boxes')) && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Reference Image</label>
                    <div className="border-2 border-dashed border-[#FAC1B5]/30 rounded-xl p-6 text-center hover:border-[#F283AE] transition-colors bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-detail"
                      />
                      <label htmlFor="image-upload-detail" className="cursor-pointer">
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
                )}

              {/* Flowers availability note */}
              {product.category?.toLowerCase().includes('flower box') && (
                <div className="bg-[#98B8B9]/10 p-4 rounded-xl border border-[#98B8B9]/30">
                  <p className="text-sm text-[#2C2C2C]">
                    <span className="font-bold">Note:</span> Flowers will be selected based on availability.
                  </p>
                </div>
              )}

              {/* Price & CTA Section Removed */}

              {addedToCart && (
                <div className="bg-green-50 text-green-600 p-3 rounded-xl text-center text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                  ✓ Added to cart successfully!
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add to Cart
                  </>
                )}
              </button>

              <div className="bg-[#C6C870]/10 p-4 rounded-xl border border-[#C6C870]/30">
                <p className="text-xs text-[#2C2C2C] leading-relaxed">
                  <span className="font-semibold">Note:</span> All orders must be placed at least 48 hours in advance.
                  Our team will contact you on WhatsApp within 12 hours with payment details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
