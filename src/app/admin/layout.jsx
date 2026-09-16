import React from 'react';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
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
