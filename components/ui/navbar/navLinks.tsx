// package
import Link from "next/link";
import { usePathname } from "next/navigation";

// ui
import NavDropdown from "@/ui/navbar/navDropdown";
import { NavLinkProps } from "@/ui/navbar/definition";

// lib
import { cn } from "@/lib/utils";

const links = [
  { name: 'About', href: '/about' },
  { name: 'Artists', href: '/artist' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-12">
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
