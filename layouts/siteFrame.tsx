'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
}