"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ContactInfo {
  phone1: string;
}

const Header = ({ contactInfo }: { contactInfo: ContactInfo | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky border-b top-0 left-0 right-0 z-50 py-3 bg-white",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo-eftah.png"
                alt="Eftah Logo"
                width={1000}
                height={1000}
                className="size-16 rounded-full object-cover"
              />
            </Link>
            <Link href="/">
              <div>
                <h1 className="text-xl font-bold">Eftah Fast Food</h1>
                <p className="text-sm text-gray-500">Best in Town!</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-700 hover:text-red-500 font-medium transition-colors",
                  pathname === link.href && "text-red-500"
                )}
              >
                {link.label}
              </Link>
            ))}
            {contactInfo && (
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full gap-2"
                asChild
              >
                <Link href={`tel:${contactInfo.phone1}`}>
                  <Phone className="h-4 w-4" />
                  Order Now
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-red-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-gray-700 hover:text-red-500 font-medium transition-colors",
                      pathname === link.href && "text-red-500"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {contactInfo && (
                  <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full gap-2"
                    asChild
                  >
                    <Link href={`tel:${contactInfo.phone1}`}>
                      <Phone className="h-4 w-4" />
                      Order Now
                    </Link>
                  </Button>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
