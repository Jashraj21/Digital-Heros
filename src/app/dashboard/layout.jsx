import React from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar />
          <main className="flex-1 min-w-0 space-y-6">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
