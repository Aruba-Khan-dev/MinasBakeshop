import AdminSidebar from '@/components/admin-sidebar';
import AdminPageLayout from '@/components/admin-page-layout';
import AdminReviewsTable from '@/components/admin/admin-reviews-table';
import { AdminSidebarProvider } from '@/context/admin-sidebar-context';
import { getReviews } from '@/lib/supabase';

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#F0E8DF]/20">
        <AdminSidebar activeTab="reviews" />
        <AdminPageLayout>
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#2C2C2C] sm:text-4xl">Customer Reviews</h1>
            <p className="text-[#98898D] mt-2">
              View and manage all reviews submitted by customers on the website
            </p>
          </div>

          <AdminReviewsTable reviews={reviews} />
        </AdminPageLayout>
      </div>
    </AdminSidebarProvider>
  );
}
