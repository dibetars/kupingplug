"use client";

// package
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ui
import {
  HamburgerMenu,
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import NavDropdown from "./navDropdown";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isRootPage = useRootContext();
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const handleOnScroll = () => {
    window.scrollY >= 32 ? setScroll(true) : setScroll(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-[100]",
        isRootPage ? "bg-[#ffc95c]" : "bg-white",
        scroll && "bg-white shadow transition-colors duration-200 ease-in",
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <NavDropdown />
          </div>
          <Link href="/" className="flex items-center">
            <Image
              src="/IDSolo.jpg"
              alt="ID RCRDS Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex-1" />

        <div className="hidden lg:flex">
          <NavLinks />
        </div>

        {/* mobile navbar */}
        <NavMobile open={open} onClick={() => setOpen(false)} />
      </nav>
    </div>
  );
};

export default Navbar;
