'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Artists', href: '/admin/artists' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Content', href: '/admin/content' },
    { name: 'Gallery', href: '/admin/gallery' },
  ];

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-full">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-semibold">Admin</Link>
          <nav className="flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className={pathname.startsWith(l.href) ? 'text-sm text-black font-semibold' : 'text-sm text-gray-700 hover:text-black'}
              >
                {l.name}
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black px-3 py-1 rounded-md text-sm"
            >
              View Site
            </a>
            <button onClick={logout} className="text-sm text-gray-700 hover:text-black">Logout</button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}