'use client'

import { useAdminSidebar } from '@/context/admin-sidebar-context'
import { ReactNode } from 'react'

export default function AdminPageLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useAdminSidebar()

  return (
    <div
      className={`min-h-screen min-w-0 overflow-x-hidden px-4 pb-12 pt-24 transition-all duration-300 ease-linear sm:px-6 md:px-8 md:pt-20 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-0'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl min-w-0">{children}</div>
    </div>
  )
}
