import AdminSidebar from '@/components/admin-sidebar';
import AdminOrdersTable from '@/components/admin/admin-orders-table';
import { getOrders } from '@/lib/supabase';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import AdminPageLayout from '@/components/admin-page-layout';

// Force dynamic rendering so Vercel always fetches fresh orders from Supabase
export const dynamic = 'force-dynamic';

export default async function AdminCustomOrdersPage() {
  const allOrders = await getOrders();
  const customOrders = allOrders.filter((order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    return items.some((item: any) => item.category === 'Custom');
  });

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="custom-orders" />
        <AdminPageLayout>
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#2C2C2C] sm:text-4xl">Custom Orders</h1>
            <p className="text-[#98898D] mt-2">Track and manage custom customer requests</p>
          </div>

          <AdminOrdersTable orders={customOrders} isCustom={true} />
        </AdminPageLayout>
      </div>
    </AdminSidebarProvider>
  );
}
