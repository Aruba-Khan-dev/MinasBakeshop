'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import AdminPageLayout from '@/components/admin-page-layout';
import Link from 'next/link';
import { Package, Layers, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function DashboardContent() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [sizeCount, setSizeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState<{ id: number; name: string; category: string; created_at: string }[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        setProductCount(pCount || 0);

        const { data: cats } = await supabase.from('products').select('category');
        setCategoryCount(new Set(cats?.map(c => c.category)).size);

        const { count: sCount } = await supabase.from('product_sizes').select('*', { count: 'exact', head: true });
        setSizeCount(sCount || 0);

        const { data: recent } = await supabase.from('products').select('id, name, category, created_at').order('created_at', { ascending: false }).limit(5);
        setRecentProducts(recent || []);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Products', value: productCount, icon: Package, color: '#F283AE' },
    { title: 'Categories', value: categoryCount, icon: Layers, color: '#C59FBE' },
    { title: 'Size Variants', value: sizeCount, icon: ShoppingBag, color: '#98B8B9' },
  ];

  return (
      <AdminPageLayout>
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl font-serif text-[#2C2C2C] mb-2 sm:text-4xl">Dashboard</h1>
        <p className="text-[#98898D]">Welcome back! Here&apos;s what&apos;s happening with your bakery.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-[#FAC1B5]/20">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
              <h3 className="text-[#98898D] text-sm font-semibold mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#2C2C2C]">
                {loading ? <Loader2 size={20} className="animate-spin text-[#F283AE]" /> : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Products */}
      <div className="overflow-hidden rounded-lg border border-[#FAC1B5]/20 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#FAC1B5]/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-xl font-serif text-[#2C2C2C]">Recently Added Products</h2>
          <Link href="/admin/products" className="text-sm text-[#F283AE] font-semibold hover:underline">View All</Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-[#F283AE]" /></div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-12 text-[#98898D]">No products yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-[#FAC1B5]/20">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#98898D] sm:px-6">Name</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#98898D] sm:px-6">Category</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#98898D] sm:px-6">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.id} className="border-b border-[#FAC1B5]/20 hover:bg-[#F0E8DF]/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-semibold text-[#2C2C2C] sm:px-6">{p.name}</td>
                    <td className="px-4 py-4 text-sm sm:px-6"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F283AE]/10 text-[#F283AE]">{p.category}</span></td>
                    <td className="px-4 py-4 text-sm text-[#98898D] sm:px-6">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 sm:mt-12">
        <div className="w-full max-w-2xl rounded-lg border border-[#FAC1B5]/20 bg-white p-4 shadow-sm sm:p-8">
          <h3 className="text-xl font-serif text-[#2C2C2C] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/products" className="block p-4 border border-[#FAC1B5]/30 rounded-lg hover:bg-[#F0E8DF]/30 transition-colors text-[#2C2C2C] font-semibold">
              Manage Products
            </Link>
            <Link href="/admin/orders" className="block p-4 border border-[#FAC1B5]/30 rounded-lg hover:bg-[#F0E8DF]/30 transition-colors text-[#2C2C2C] font-semibold">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="dashboard" />
        <DashboardContent />
      </div>
    </AdminSidebarProvider>
  );
}
