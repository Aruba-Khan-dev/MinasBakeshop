'use client';

import { useCallback, useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import AdminPageLayout from '@/components/admin-page-layout';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import { trimValue, validateItemName, hasErrors } from '@/lib/validation';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-[#FAC1B5]/30 focus:outline-none focus:border-[#F283AE]';

const GROUPS = ['Cakes', 'Desserts', 'Luxury Gifting', 'Other'];

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', group: 'Cakes' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [touched, setTouched] = useState<{ name?: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

  const validateForm = useCallback(() => {
    const next = { name: validateItemName(form.name, 'Category name') };
    setFieldErrors(next);
    setTouched({ name: true });
    return !hasErrors(next);
  }, [form.name]);

  const blurValidate = () => {
    setTouched({ name: true });
    setFieldErrors({ name: validateItemName(form.name, 'Category name') });
  };

  const fieldInvalid = Boolean(touched.name && fieldErrors.name);

  useEffect(() => { fetchCats(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  async function fetchCats() {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to fetch categories', type: 'error' });
    } finally { setLoading(false); }
  }

  function toSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[\/&]/g, ' ')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function openAdd() {
    setEditingId(null);
    setForm({ name: '', group: 'Cakes' });
    setTouched({});
    setFieldErrors({});
    setShowModal(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id!);
    setForm({ name: cat.name, group: cat.group });
    setTouched({});
    setFieldErrors({});
    setShowModal(true);
  }

  async function handleSave() {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const cleanName = trimValue(form.name);
      const catData = {
        name: cleanName,
        slug: toSlug(cleanName),
        group: form.group,
      };

      if (editingId) {
        await updateCategory(editingId, catData);
        setToast({ message: 'Category updated!', type: 'success' });
      } else {
        await createCategory(catData);
        setToast({ message: 'Category added!', type: 'success' });
      }
      setShowModal(false);
      fetchCats();
    } catch (err: any) {
      setToast({ message: err.message || 'Save failed', type: 'error' });
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure? This won\'t delete products, but they will be uncategorized in filters.')) return;
    try {
      await deleteCategory(id);
      setToast({ message: 'Category deleted!', type: 'success' });
      fetchCats();
    } catch (err: any) {
      setToast({ message: err.message || 'Delete failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && (
        <div className={`fixed left-4 right-4 top-24 z-[80] px-6 py-3 rounded-xl shadow-lg text-white font-semibold sm:left-auto sm:right-8 sm:max-w-md ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <AdminPageLayout>
        <div className="mb-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-serif text-[#2C2C2C] sm:text-4xl">Categories</h1>
            <p className="text-[#98898D] mt-2">Manage shop categories and groupings</p>
          </div>
          <button onClick={openAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F283AE] px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#E86FA3] sm:w-auto">
            <Plus size={20} /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#F283AE]" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#FAC1B5]/20 overflow-hidden">
            <div className="space-y-3 p-4 md:hidden">
              {categories.length === 0 ? (
                <div className="py-10 text-center text-[#98898D]">No categories found.</div>
              ) : categories.map((cat) => (
                <div key={cat.id} className="rounded-lg border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-[#2C2C2C]">{cat.name}</p>
                      <p className="mt-1 break-all text-sm text-[#98898D]">{cat.slug}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-[#F283AE] transition-colors hover:bg-[#F283AE]/10" aria-label={`Edit ${cat.name}`}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id!)} className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50" aria-label={`Delete ${cat.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-[#F283AE]/10 px-3 py-1 text-xs font-semibold text-[#F283AE]">
                    {cat.group}
                  </span>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#FAC1B5]/20 bg-[#F0E8DF]/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Group</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#98898D]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-[#98898D]">No categories found.</td></tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-[#FAC1B5]/20 hover:bg-[#F0E8DF]/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#2C2C2C]">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-[#98898D]">{cat.slug}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F283AE]/10 text-[#F283AE]">
                          {cat.group}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-[#F283AE]/10 text-[#F283AE] transition-colors" aria-label={`Edit ${cat.name}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat.id!)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label={`Delete ${cat.name}`}>
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

      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:items-center">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#FAC1B5]/20">
              <h2 className="text-xl font-serif text-[#2C2C2C]">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <ValidatedField label="Category Name" htmlFor="category-name" required error={fieldErrors.name} touched={touched.name}>
                <input
                  id="category-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={blurValidate}
                  placeholder="e.g. Vintage Cakes"
                  aria-invalid={fieldInvalid}
                  className={invalidFieldClass(fieldInvalid, INPUT_CLASS)}
                />
              </ValidatedField>
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">Sidebar Group</label>
                <select value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#FAC1B5]/30 focus:outline-none focus:border-[#F283AE]">
                  {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#FAC1B5]/20 px-6 py-4 sm:flex-row sm:justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-full border border-[#FAC1B5]/30 px-6 py-2 font-semibold text-[#2C2C2C]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 rounded-full bg-[#F283AE] px-6 py-2 font-semibold text-white hover:bg-[#E86FA3] disabled:opacity-50">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="categories" />
        <CategoriesContent />
      </div>
    </AdminSidebarProvider>
  );
}
