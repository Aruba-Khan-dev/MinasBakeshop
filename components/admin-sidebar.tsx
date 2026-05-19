'use client'

import { useAdminSidebar } from '@/context/admin-sidebar-context'
import Link from 'next/link'
import { LayoutDashboard, ClipboardList, Package, Layers, MessageSquare, Menu, X, Sparkles } from 'lucide-react'
import AdminLogoutButton from '@/components/admin-logout-button'
import { useState } from 'react'

export default function AdminSidebar({ activeTab }: { activeTab: string }) {
  const { sidebarOpen, setSidebarOpen } = useAdminSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
    { id: 'categories', label: 'Categories', icon: Layers, href: '/admin/categories' },
    { id: 'orders', label: 'Orders', icon: ClipboardList, href: '/admin/orders' },
    { id: 'custom-orders', label: 'Custom Orders', icon: Sparkles, href: '/admin/custom-orders' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, href: '/admin/reviews' },
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-6 top-6 z-[60] rounded-lg border border-[#FAC1B5]/30 bg-white/95 p-2 text-[#2C2C2C] shadow-sm transition-colors hover:bg-[#F0E8DF] md:hidden"
        aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
        title={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-6 top-6 z-[60] hidden rounded-lg border border-[#FAC1B5]/30 bg-white/95 p-2 text-[#2C2C2C] shadow-sm transition-colors hover:bg-[#F0E8DF] md:flex"
        aria-label={sidebarOpen ? 'Collapse admin menu' : 'Open admin menu'}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col overflow-y-auto bg-[#2C2C2C] text-white shadow-lg transition-transform duration-300 ease-linear md:w-64 md:max-w-none md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 pt-16 pb-6 px-6 text-center flex flex-col items-center">
          <h2 className="text-xl font-serif">Admin Panel</h2>
          <p className="text-xs text-white/60 mt-1">Minas Bakeshop</p>
        </div>

        <nav className="p-6 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#F283AE] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block w-full px-4 py-3 text-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-semibold"
          >
            Back to Store
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>
    </>
  )
}
