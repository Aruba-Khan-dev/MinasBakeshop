import AdminSidebar from '@/components/admin-sidebar';
import AdminOrdersTable from '@/components/admin/admin-orders-table';
import { getOrders } from '@/lib/supabase';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import AdminPageLayout from '@/components/admin-page-layout';

// Force dynamic rendering so Vercel always fetches fresh orders from Supabase
// (without this, Next.js caches the server component and new orders won't appear)
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="orders" />
        <AdminPageLayout>
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#2C2C2C] sm:text-4xl">Orders</h1>
            <p className="text-[#98898D] mt-2">Track and manage all customer orders</p>
          </div>

          <AdminOrdersTable orders={orders} />
        </AdminPageLayout>
      </div>
    </AdminSidebarProvider>
  );
}
