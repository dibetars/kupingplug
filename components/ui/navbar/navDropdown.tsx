'use client';
// package
import { useState } from "react";
import Link from "next/link";

// ui
import { NavDropdownProps, SubLinkProps } from "@/ui/navbar/definition";
import { DropdownIcon } from "@/ui/assets/svg";

const NavDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'About', href: '/about' },
    { name: 'Artists', href: '/artist' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;

function DropdownSubLinks({ subLinks }: { subLinks?: SubLinkProps[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ul className="min-w-[250px] rounded-lg border border-gray-400 bg-white p-1 shadow-lg">
      {/* map subLinks */}
      {subLinks?.map((link, idx) => (
        <li key={link.path} className="relative">
          {/* check for nested sublinks */}
          {link.subLinks ? (
            <div onMouseLeave={() => setActiveIndex(null)}>
              <button
                onMouseOver={() => setActiveIndex(idx)}
                className="flex w-full items-center justify-between rounded-md px-4 py-2 font-inter text-sm text-[#141718] hover:bg-gray-200"
              >
                <span>{link.name}</span>
                <DropdownIcon className="h-[18px] w-[18px] -rotate-90" />
              </button>
              {activeIndex === idx && (
                <div className="absolute left-full top-0 pl-4">
                  <DropdownSubLinks subLinks={link.subLinks} />
                </div>
              )}
            </div>
          ) : (
            <Link
              href={link.path}
              className="inline-block w-full rounded-md px-4 py-2 font-inter text-sm text-[#141718] hover:bg-gray-200"
            >
              {link.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
