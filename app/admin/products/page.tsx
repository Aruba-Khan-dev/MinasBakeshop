'use client';

import { useCallback, useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import AdminPageLayout from '@/components/admin-page-layout';
import { Plus, Pencil, Trash2, X, Save, Loader2, Search, Package } from 'lucide-react';
import { supabase, getAllCategories } from '@/lib/supabase';
import type { Product, Category } from '@/lib/supabase';
import { rankProductsBySearch } from '@/lib/search-products';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import {
  trimValue,
  validateItemName,
  validateRequired,
  validateProductSizes,
  hasErrors,
} from '@/lib/validation';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-[#FAC1B5]/30 focus:outline-none focus:border-[#F283AE]';

type ProductFormFields = 'name' | 'category' | 'sizes';

interface FormState {
  name: string;
  category: string;
  description: string;
  image_url: string;
}

const emptyForm: FormState = { name: '', category: '', description: '', image_url: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sizes, setSizes] = useState<{ size_label: string; price: number }[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ProductFormFields, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProductFormFields, string>>>({});

  const validateForm = useCallback(() => {
    const next = {
      name: validateItemName(form.name, 'Product name'),
      category: validateRequired(form.category, 'Category'),
      sizes: validateProductSizes(sizes),
    };
    setFieldErrors(next);
    setTouched({ name: true, category: true, sizes: true });
    return !hasErrors(next);
  }, [form, sizes]);

  const blurValidate = (field: ProductFormFields) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const validators = {
      name: () => validateItemName(form.name, 'Product name'),
      category: () => validateRequired(form.category, 'Category'),
      sizes: () => validateProductSizes(sizes),
    };
    setFieldErrors((e) => ({ ...e, [field]: validators[field]() }));
  };

  const fieldInvalid = (field: ProductFormFields) =>
    Boolean(touched[field] && fieldErrors[field]);

  useEffect(() => { 
    fetchData(); 
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        supabase.from('products').select('*, product_sizes(*)').order('category').order('name'),
        getAllCategories()
      ]);
      
      if (productsData.error) throw productsData.error;
      setProducts(productsData.data || []);
      setCategories(categoriesData || []);
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to fetch', type: 'error' });
    } finally { setLoading(false); }
  }

  async function fetchProducts() {
    // Keep this for refreshing after save
    try {
      const { data, error } = await supabase
        .from('products').select('*, product_sizes(*)').order('category').order('name');
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to refresh', type: 'error' });
    }
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setSizes([]);
    setTouched({});
    setFieldErrors({});
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id!);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description || '',
      image_url: product.image_url || '',
    });
    setSizes(product.product_sizes?.map(s => ({ size_label: s.size_label, price: s.price })) || []);
    setTouched({});
    setFieldErrors({});
    setShowModal(true);
  }

  async function handleSave() {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const productData = {
        name: trimValue(form.name),
        category: form.category,
        description: trimValue(form.description) || null,
        image_url: trimValue(form.image_url) || null,
      };

      if (editingId) {
        // Update product
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        // Replace sizes
        await supabase.from('product_sizes').delete().eq('product_id', editingId);
        if (sizes.length > 0) {
          const { error: sErr } = await supabase.from('product_sizes')
            .insert(sizes.map(s => ({ ...s, product_id: editingId })));
          if (sErr) throw sErr;
        }
        setToast({ message: 'Product updated!', type: 'success' });
      } else {
        // Create product
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) throw error;
        if (sizes.length > 0 && data) {
          const { error: sErr } = await supabase.from('product_sizes')
            .insert(sizes.map(s => ({ ...s, product_id: data.id })));
          if (sErr) throw sErr;
        }
        setToast({ message: 'Product added!', type: 'success' });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : 'Save failed', type: 'error' });
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setToast({ message: 'Product deleted!', type: 'success' });
      fetchProducts();
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : 'Delete failed', type: 'error' });
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      setForm(f => ({ ...f, image_url: data.publicUrl }));
      setToast({ message: 'Image uploaded successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  }

  // Get unique categories from actual data for filter dropdown
  const uniqueCategories = [...new Set(products.map(p => p.category))]
    .filter(c => c !== 'Special Size Cakes')
    .sort();

  const categoryFiltered = products.filter(
    (p) => filterCat === 'all' || p.category === filterCat
  );
  const filtered = search.trim()
    ? rankProductsBySearch(categoryFiltered, search, categoryFiltered.length)
    : categoryFiltered;

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="products" />

        {toast && (
          <div className={`fixed left-4 right-4 top-24 z-[80] px-6 py-3 rounded-xl shadow-lg text-white font-semibold sm:left-auto sm:right-8 sm:max-w-md ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        <AdminPageLayout>
          {/* Header */}
          <div className="mb-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-serif text-[#2C2C2C] sm:text-4xl">Products</h1>
              <p className="text-[#98898D] mt-2">{products.length} products in database</p>
            </div>
            <button onClick={openAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F283AE] px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#E86FA3] hover:shadow-lg sm:w-auto">
              <Plus size={20} /> Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98898D]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#FAC1B5]/30 bg-white focus:outline-none focus:border-[#F283AE]" />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="w-full rounded-xl border border-[#FAC1B5]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#F283AE] sm:w-64">
              <option value="all">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#F283AE]" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#FAC1B5]/20 overflow-hidden">
              <div className="space-y-3 p-4 md:hidden">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center text-[#98898D]">No products found.</div>
                ) : filtered.map((product) => (
                  <div key={product.id} className="rounded-lg border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
                    <div className="flex items-start gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F283AE]/10">
                          <Package size={20} className="text-[#F283AE]" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-semibold text-[#2C2C2C]">{product.name}</p>
                        {product.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-[#98898D]">{product.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-[#F283AE] transition-colors hover:bg-[#F283AE]/10" aria-label={`Edit ${product.name}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id!)} className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50" aria-label={`Delete ${product.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F283AE]/10 px-3 py-1 text-xs font-semibold text-[#F283AE]">{product.category}</span>
                      {product.product_sizes && product.product_sizes.length > 0 ? (
                        product.product_sizes.map((s, i) => (
                          <span key={i} className="rounded-full bg-white px-3 py-1 text-xs text-[#2C2C2C]">
                            <span className="text-[#98898D]">{s.size_label}:</span> <span className="font-semibold">Rs. {s.price.toLocaleString()}</span>
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-white px-3 py-1 text-xs text-[#98898D]">No sizes</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[#FAC1B5]/20 bg-[#F0E8DF]/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Sizes/Prices</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#98898D]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-[#98898D]">No products found.</td></tr>
                    ) : filtered.map((product) => (
                      <tr key={product.id} className="border-b border-[#FAC1B5]/20 hover:bg-[#F0E8DF]/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F283AE]/10">
                                <Package size={18} className="text-[#F283AE]" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-semibold text-[#2C2C2C] block">{product.name}</span>
                              {product.description && (
                                <span className="text-xs text-[#98898D] line-clamp-1">{product.description}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F283AE]/10 text-[#F283AE]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2C2C2C]">
                          {product.product_sizes && product.product_sizes.length > 0 ? (
                            <div className="space-y-0.5">
                              {product.product_sizes.map((s, i) => (
                                <div key={i} className="text-xs">
                                  <span className="text-[#98898D]">{s.size_label}:</span>{' '}
                                  <span className="font-semibold">Rs. {s.price.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#98898D] text-xs">No sizes</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-[#F283AE]/10 text-[#F283AE] transition-colors" aria-label={`Edit ${product.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id!)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label={`Delete ${product.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AdminPageLayout>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-10">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#FAC1B5]/20">
              <h2 className="text-xl font-serif text-[#2C2C2C]">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <div className="max-h-[calc(100vh-13rem)] space-y-5 overflow-y-auto p-4 sm:p-6">
              <ValidatedField label="Product Name" htmlFor="product-name" required error={fieldErrors.name} touched={touched.name}>
                <input
                  id="product-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={() => blurValidate('name')}
                  placeholder="e.g. Elegant White Pearl"
                  aria-invalid={fieldInvalid('name')}
                  className={invalidFieldClass(fieldInvalid('name'), INPUT_CLASS)}
                />
              </ValidatedField>

              <ValidatedField label="Category" htmlFor="product-category" required error={fieldErrors.category} touched={touched.category}>
                <select
                  id="product-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  onBlur={() => blurValidate('category')}
                  aria-invalid={fieldInvalid('category')}
                  className={invalidFieldClass(fieldInvalid('category'), INPUT_CLASS)}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </ValidatedField>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-4 py-3 rounded-xl border border-[#FAC1B5]/30 focus:outline-none focus:border-[#F283AE]"
                  placeholder="Product description..." />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">Product Image</label>
                <div className="space-y-3">
                  {form.image_url && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#FAC1B5]/30">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setForm(f => ({ ...f, image_url: '' }))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:bg-red-50">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="cursor-pointer px-4 py-2.5 bg-[#F0E8DF]/50 hover:bg-[#F0E8DF] text-[#2C2C2C] text-sm font-semibold rounded-lg transition-colors border border-[#FAC1B5]/30 flex items-center gap-2">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                    <span className="text-[#98898D] text-sm sm:text-center">or</span>
                    <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#FAC1B5]/30 focus:outline-none focus:border-[#F283AE] text-sm"
                      placeholder="Paste image URL..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Sizes & Prices</label>
                {touched.sizes && fieldErrors.sizes && (
                  <p className="text-sm text-red-600 mb-2" role="alert">{fieldErrors.sizes}</p>
                )}
                {sizes.map((s, i) => (
                  <div key={i} className="mb-2 grid grid-cols-[minmax(0,1fr)_6.5rem_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_auto]">
                    <input value={s.size_label} onChange={e => { const n = [...sizes]; n[i].size_label = e.target.value; setSizes(n); }}
                      placeholder="e.g. 1 Pound" className="flex-1 px-3 py-2 rounded-lg border border-[#FAC1B5]/30 text-sm focus:outline-none focus:border-[#F283AE]" />
                    <input type="number" value={s.price} onChange={e => { const n = [...sizes]; n[i].price = Number(e.target.value); setSizes(n); }}
                      placeholder="Price" className="w-full px-3 py-2 rounded-lg border border-[#FAC1B5]/30 text-sm focus:outline-none focus:border-[#F283AE]" />
                    <button onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2"><X size={16} /></button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSizes([...sizes, { size_label: '', price: 0 }]);
                    blurValidate('sizes');
                  }}
                  className="text-sm text-[#F283AE] font-semibold hover:underline mt-1"
                >
                  + Add Size
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-[#FAC1B5]/20 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button onClick={() => setShowModal(false)} className="rounded-full border border-[#FAC1B5]/30 px-6 py-3 font-semibold text-[#2C2C2C] hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 rounded-full bg-[#F283AE] px-6 py-3 font-semibold text-white hover:bg-[#E86FA3] disabled:opacity-50">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editingId ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebarProvider>
  );
}
