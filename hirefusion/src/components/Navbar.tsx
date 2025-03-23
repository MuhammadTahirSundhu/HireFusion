"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTachometerAlt,
  FaAddressBook,
  FaClone,
  FaCalendarAlt,
  FaChartBar,
  FaCopy,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/"; // Ensure pathname is always a valid string

  const navItems = [
    { href: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/address-book", label: "Address Book", icon: <FaAddressBook /> },
    { href: "/components", label: "Components", icon: <FaClone /> },
    { href: "/calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { href: "/charts", label: "Charts", icon: <FaChartBar /> },
    { href: "/documents", label: "Documents", icon: <FaCopy /> },
  ];

  return (
    <nav className="bg-blue-600 p-4 shadow-lg" role="navigation">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="text-white text-xl font-bold">
          Navbar
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <FaBars size={24} />
        </button>

        {/* Navigation Links */}
        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent md:flex md:space-x-6 transition-all ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.href} className="list-none">
              <Link
                href={item.href}
                className={`flex items-center gap-2 p-3 md:p-2 text-white transition-colors duration-300 rounded-md ${
                  pathname.startsWith(item.href)
                    ? "bg-white text-blue-600 shadow-md"
                    : "hover:text-blue-300"
                }`}
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
