'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login');
      }
    }
  }, [isLoading, isLoginPage, user, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <AdminNavbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />
          <main className="flex-1 min-w-0 space-y-6">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
