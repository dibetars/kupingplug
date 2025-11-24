'use client';
// package
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ui
import { DropdownIcon } from "@/ui/assets/svg";
import { generateSlug } from "@/lib/utils";

// lib
import { cn } from "@/lib/utils";

const links = [
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

const artistNames = [
  'Midnight Suns',
  'King Midnight',
  'Wesley Rhymes',
];

export default function NavLinks() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      const target = e.target as Node;
      if (!menuRef.current.contains(target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="flex items-center gap-12">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          <span>Artists</span>
          <DropdownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div
            id="artists-menu"
            role="menu"
            className="absolute left-0 mt-2 z-50 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
          >
            {artistNames.map((name) => (
              <Link
                key={name}
                href={`/artist/${generateSlug(name)}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
