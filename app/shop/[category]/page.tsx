'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Minus, ShoppingBag, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import {
  FLAVOURS,
  ADD_ONS,
} from '@/lib/products';
import { useCart } from '@/context/cart-context';

// Color mapping for categories
const categoryColors: Record<string, { accent: string; gradient: string }> = {
  'vintage-cakes': { accent: '#C59FBE', gradient: 'from-[#C59FBE]/10 to-[#FAC1B5]/10' },
  'wedding-cakes': { accent: '#C59FBE', gradient: 'from-[#C59FBE]/10 to-[#FAC1B5]/10' },
  'baby-cakes': { accent: '#98B8B9', gradient: 'from-[#98B8B9]/10 to-[#C6C870]/10' },
  'fresh-flower-cakes': { accent: '#F283AE', gradient: 'from-[#F283AE]/10 to-[#FAC1B5]/10' },
  'valentines-day-cakes': { accent: '#F283AE', gradient: 'from-[#F283AE]/10 to-[#FAC1B5]/10' },
  'eid-cakes': { accent: '#C6C870', gradient: 'from-[#C6C870]/10 to-[#98B8B9]/10' },
  'mothers-day-cakes': { accent: '#F283AE', gradient: 'from-[#F283AE]/10 to-[#FAC1B5]/10' },
  'anniversary-cakes': { accent: '#FAC1B5', gradient: 'from-[#FAC1B5]/10 to-[#C59FBE]/10' },
  'default': { accent: '#F283AE', gradient: 'from-[#F283AE]/10 to-[#FAC1B5]/10' },
};

// Check if a category is a "luxury gifting" parent page
function isLuxuryParent(slug: string) {
  return slug === 'luxury-gifting';
}

const LUXURY_SUBCATEGORIES = ['Cupcake Bento Boxes', 'Bento Flower Boxes', 'Hampers & Gift Boxes'];

export default function ShopCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const categorySlug = category.toLowerCase();
  const colors = categoryColors[categorySlug] || categoryColors['default'];
  const { addItem } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // State for product detail view
  const [selectedSize, setSelectedSize] = useState<{ size_label: string; price: number } | null>(null);
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [selectedCakeFlavour, setSelectedCakeFlavour] = useState('');
  const [selectedCupcakeFlavour, setSelectedCupcakeFlavour] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [theme, setTheme] = useState('');
  const [colorPreferences, setColorPreferences] = useState('');
  const [referenceImage, setReferenceImage] = useState('');
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch category name from DB
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name')
          .eq('slug', categorySlug)
          .single();

        const displayName = catData?.name || categorySlug;
        setCategoryName(displayName);

        let query = supabase.from('products').select('*, product_sizes(*)');

        if (isLuxuryParent(categorySlug)) {
          // Fetch all luxury sub-categories
          query = query.in('category', LUXURY_SUBCATEGORIES);
        } else if (categorySlug === 'mothers-day-cakes') {
          query = query.in('category', ["Mother's Day Cakes", "Mother’s Day Cakes"]);
        } else {
          query = query.eq('category', displayName);
        }

        const { data, error } = await query.order('name');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setCategoryName(categorySlug);
      } finally { setLoading(false); }
    }
    fetchData();
  }, [categorySlug]);

  // When a product is selected for detail view
  function viewProduct(product: Product) {
    if (!product.id) return;

    router.push(`/shop/${categorySlug}/${product.id}`);
  }

  function backToGrid() {
    setSelectedProduct(null);
    setReferenceImageFile(null);
    setImagePreview(null);
  }

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

  async function handleAddToCart() {
    if (!selectedProduct) return;

    let finalReferenceImage = referenceImage;

    // If there's a file, we should ideally upload it. 
    // But since the order goes to WhatsApp, we can either:
    // 1. Upload to Supabase and send the link.
    // 2. Just keep the preview and tell them to share on WhatsApp.
    // Let's try to upload it if possible.
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
        // Fallback: just use a placeholder text
        finalReferenceImage = "Image uploaded (see WhatsApp)";
      } finally {
        setUploading(false);
      }
    }

    const addOnLabels = selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.label).filter(Boolean) as string[];

    addItem({
      id: String(selectedProduct.id),
      name: selectedProduct.name,
      category: selectedProduct.category,
      size: selectedProduct.category === 'Bento Flower Boxes' ? 'Standard' : (selectedSize?.size_label || 'Default'),
      flavour: selectedFlavour || 'None',
      cakeFlavour: selectedCakeFlavour || undefined,
      cupcakeFlavour: selectedCupcakeFlavour || undefined,
      shape: selectedShape || undefined,
      addOns: addOnLabels,
      messageOnCake,
      theme,
      colorPreferences,
      referenceImage: finalReferenceImage,
      specialInstructions,
      quantity: (selectedProduct.category?.toLowerCase().includes('bento') ||
        selectedProduct.category?.toLowerCase().includes('hampers') ||
        selectedProduct.category?.toLowerCase().includes('gift boxes')) ? 1 : quantity,
      pricePerItem: (selectedSize?.price || 0) + selectedAddOns.reduce((total, id) => total + (ADD_ONS.find(a => a.id === id)?.price || 0), 0),
      image: selectedProduct.image_url || undefined
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  }

  // ── Product Detail View ──
  if (selectedProduct) {
    const sizes = selectedProduct.product_sizes || [];
    const currentPrice = selectedSize?.price || sizes[0]?.price || 0;
    const addOnsTotal = selectedAddOns.reduce((total, id) => {
      const addOn = ADD_ONS.find(a => a.id === id);
      return total + (addOn?.price || 0);
    }, 0);
    const totalPrice = (currentPrice + addOnsTotal) * quantity;

    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-[#FFFBF8]">
        {/* Breadcrumb */}
        <div className="px-4 md:px-12 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-[#98898D] flex-wrap">
            <Link href="/" className="hover:text-[#F283AE]">Home</Link>
            <span>/</span>
            <button onClick={backToGrid} className="hover:text-[#F283AE]">{categoryName}</button>
            <span>/</span>
            <span className="text-[#2C2C2C] font-medium">{selectedProduct.name}</span>
          </div>
        </div>

        <section className="px-4 md:px-12 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Product Image */}
              <div className="relative">
                <div className="sticky top-24">
                  <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.accent}15` }}>
                    {selectedProduct.image_url ? (
                      <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
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
                  <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-2">{selectedProduct.name}</h1>
                  <p className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
                    Rs. {(selectedSize?.price || sizes[0]?.price || 0).toLocaleString()}
                  </p>
                  {(selectedProduct.category?.toLowerCase().includes('hamper') || selectedProduct.category?.toLowerCase().includes('gift box') || selectedProduct.category?.toLowerCase().includes('hampers') || selectedProduct.category?.toLowerCase().includes('gift boxes')) && selectedProduct.description && (
                    <p className="text-[#98898D] text-lg whitespace-pre-wrap">{selectedProduct.description}</p>
                  )}
                </div>

                <hr className="border-[#FAC1B5]/30" />

                {/* Size Selection */}
                {sizes.length > 0 &&
                  !selectedProduct.category?.toLowerCase().includes('bento') &&
                  !selectedProduct.category?.toLowerCase().includes('hampers') &&
                  !selectedProduct.category?.toLowerCase().includes('gift boxes') &&
                  selectedProduct.category?.toLowerCase() !== 'loaf cakes' && (
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

                {/* No sizes - show as custom pricing */}
                {sizes.length === 0 && (
                  <div className="bg-[#F283AE]/5 rounded-xl p-4 border border-[#F283AE]/20">
                    <p className="text-[#98898D]">Contact us for pricing on this product.</p>
                  </div>
                )}

                {/* Flavour Selection (Standard) */}
                {selectedProduct.category?.toLowerCase() !== 'loaf cakes' &&
                  selectedProduct.category?.toLowerCase() !== 'brownies' &&
                  selectedProduct.category?.toLowerCase() !== 'cookies' &&
                  !selectedProduct.category?.toLowerCase().includes('cupcake bento') &&
                  !selectedProduct.category?.toLowerCase().includes('hampers') &&
                  !selectedProduct.category?.toLowerCase().includes('gift boxes') && (
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Select Flavour *</label>
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

                {/* Single Flavour Selection for Bento Flower Box and Sunshine Hamper */}
                {(selectedProduct.category?.toLowerCase().includes('flower box') ||
                  selectedProduct.name === 'The Sunshine Hamper') && (
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
                {(selectedProduct.category?.toLowerCase().includes('cupcake bento') ||
                  selectedProduct.category?.toLowerCase().includes('hampers') ||
                  selectedProduct.category?.toLowerCase().includes('gift boxes')) &&
                  selectedProduct.name !== 'The Sunshine Hamper' && (
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
                {(selectedProduct.category?.toLowerCase().includes('flower box') ||
                  selectedProduct.category?.toLowerCase().includes('cupcake bento') ||
                  selectedProduct.category?.toLowerCase().includes('hampers') ||
                  selectedProduct.category?.toLowerCase().includes('gift boxes')) && (
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                        {selectedProduct.name === 'The Sunshine Hamper' ? 'Shape' : 'Shape(Cake)'}
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

                {/* Add-ons */}
                {selectedProduct.category?.toLowerCase() !== 'loaf cakes' &&
                  selectedProduct.category?.toLowerCase() !== 'cookies' && (
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Add-ons <span className="text-[#98898D] font-normal">(Optional)</span></label>
                      <div className="space-y-2">
                        {ADD_ONS.map((addOn) => (
                          <label key={addOn.id}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddOns.includes(addOn.id) ? 'border-[#F283AE] bg-[#F283AE]/5' : 'border-[#FAC1B5]/30 hover:border-[#FAC1B5]'}`}>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" checked={selectedAddOns.includes(addOn.id)}
                                onChange={(e) => { if (e.target.checked) { setSelectedAddOns([...selectedAddOns, addOn.id]); } else { setSelectedAddOns(selectedAddOns.filter(id => id !== addOn.id)); } }}
                                className="w-5 h-5 rounded accent-[#F283AE]" />
                              <span className="text-sm text-[#2C2C2C]">{addOn.label}</span>
                            </div>
                            <span className="text-sm font-semibold" style={{ color: colors.accent }}>Rs. {addOn.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Message on Cake/Cupcake/Brownie */}
                {selectedProduct.category?.toLowerCase() !== 'loaf cakes' &&
                  selectedProduct.category?.toLowerCase() !== 'cookies' && (
                    <div>
                      <label htmlFor="cakeMessage" className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                        {selectedProduct.category === 'Cupcakes'
                          ? 'Message on Cupcake'
                          : selectedProduct.category === 'Brownies'
                            ? 'Message on Brownies'
                            : 'Message on Cake'} <span className="text-[#98898D] font-normal">(Optional)</span>
                      </label>
                      <input
                        id="cakeMessage"
                        type="text"
                        value={messageOnCake}
                        onChange={(e) => setMessageOnCake(e.target.value)}
                        placeholder="e.g. Happy Birthday Sarah!"
                        className="w-full p-4 rounded-xl border-2 border-[#FAC1B5]/30 focus:border-[#F283AE] outline-none transition-all text-[#2C2C2C]"
                      />
                    </div>
                  )}

                {/* Theme & Color Preferences (for Bento Boxes and Gift Boxes) */}
                {(selectedProduct.category?.toLowerCase().includes('flower box') ||
                  selectedProduct.category?.toLowerCase().includes('cupcake bento') ||
                  selectedProduct.category?.toLowerCase().includes('luxury') ||
                  selectedProduct.category?.toLowerCase().includes('hampers') ||
                  selectedProduct.category?.toLowerCase().includes('gift boxes')) && (
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
                          className="w-full p-4 rounded-xl border-2 border-[#FAC1B5]/30 focus:border-[#F283AE] outline-none transition-all text-[#2C2C2C]"
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
                          className="w-full p-4 rounded-xl border-2 border-[#FAC1B5]/30 focus:border-[#F283AE] outline-none transition-all text-[#2C2C2C]"
                        />
                      </div>
                    </>
                  )}

                {/* Reference Image */}
                {(selectedProduct.category?.toLowerCase().includes('flower box') ||
                  selectedProduct.category?.toLowerCase().includes('cupcake bento') ||
                  selectedProduct.category?.toLowerCase().includes('hampers') ||
                  selectedProduct.category?.toLowerCase().includes('gift boxes')) && (
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Reference Image</label>
                      <div className="border-2 border-dashed border-[#FAC1B5]/30 rounded-xl p-6 text-center hover:border-[#F283AE] transition-colors bg-white">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload-shop"
                        />
                        <label htmlFor="image-upload-shop" className="cursor-pointer">
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

                {/* Special Instructions */}
                <div>
                  <label htmlFor="specialInstructions" className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                    Special Instructions <span className="text-[#98898D] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any specific requests or dietary notes..."
                    rows={3}
                    className="w-full p-4 rounded-xl border-2 border-[#FAC1B5]/30 focus:border-[#F283AE] outline-none transition-all text-[#2C2C2C] resize-none"
                  />
                </div>

                {/* Flowers availability note */}
                {selectedProduct.category?.toLowerCase().includes('flower box') && (
                  <div className="bg-[#98B8B9]/10 p-4 rounded-xl border border-[#98B8B9]/30">
                    <p className="text-sm text-[#2C2C2C]">
                      <span className="font-bold">Note:</span> Flowers will be selected based on availability.
                    </p>
                  </div>
                )}

                {/* Price Summary Removed */}

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
                      <Loader2 size={20} className="animate-spin" /> Uploading Image...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Category Grid View ──
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="px-4 md:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-[#98898D]">
          <Link href="/" className="hover:text-[#F283AE]">Home</Link>
          <span>/</span>
          <span className="text-[#2C2C2C] font-medium">{categoryName}</span>
        </div>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} py-10 md:py-12 px-4 md:px-12`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-3">{categoryName}</h1>
          <p className="text-base md:text-lg text-[#98898D]">Browse our beautiful {categoryName.toLowerCase()} collection</p>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-10 md:py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#F283AE]" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => viewProduct(product)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#FAC1B5]/20 hover:shadow-lg transition-all text-left"
                >
                  <div className="aspect-square flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${colors.accent}15` }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="text-center">
                        <span className="text-5xl md:text-6xl block mb-2">🎂</span>
                        <p className="text-xs text-[#98898D]">Custom Design</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-5">
                    <h3 className="font-semibold text-[#2C2C2C] text-sm md:text-base mb-1 group-hover:text-[#F283AE] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    {(product.category?.toLowerCase().includes('hamper') || product.category?.toLowerCase().includes('gift box') || product.category?.toLowerCase().includes('hampers') || product.category?.toLowerCase().includes('gift boxes')) && product.description && (
                      <p className="text-xs text-[#98898D] mb-2 md:mb-3 line-clamp-2 hidden sm:block whitespace-pre-wrap">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {product.product_sizes && product.product_sizes.length > 0 ? (
                        <p className="text-xs md:text-sm font-bold" style={{ color: colors.accent }}>
                          Rs. {product.product_sizes[0].price.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-xs text-[#98898D]">Custom pricing</p>
                      )}
                      <span className="text-xs text-[#F283AE] font-medium hidden sm:inline">View →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🎂</span>
              <h2 className="text-xl font-serif text-[#2C2C2C] mb-2">Coming Soon</h2>
              <p className="text-[#98898D] mb-6">We&apos;re adding designs to this category. Meanwhile, try our custom order!</p>
              <Link href="/customize" className="inline-block px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors">
                Create Custom Order
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How to Order */}
      <section className="py-12 px-4 md:px-12 bg-[#F0E8DF]/20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#FAC1B5]/20">
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">How to Order</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#F283AE] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-[#2C2C2C]">Select a Design</h3>
                  <p className="text-sm text-[#98898D]">Choose from our collection or share your own reference image.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#C59FBE] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-[#2C2C2C]">Pick Size & Flavour</h3>
                  <p className="text-sm text-[#98898D]">Choose your preferred size, flavour, and any add-ons.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#98B8B9] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-[#2C2C2C]">Place Order</h3>
                  <p className="text-sm text-[#98898D]">Orders must be placed at least 48 hours in advance via WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
