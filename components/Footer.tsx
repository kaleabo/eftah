"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaTiktok
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/social/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const socialLinks = settings?.links || {};

  return (
    <>
      {settings && (
        <div className="mt-8 mb-10 text-center">
          <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.facebook && (
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="size-5" />
              </Link>
            )}
            {socialLinks.instagram && (
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="size-5" />
              </Link>
            )}
            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="size-5" />
              </Link>
            )}
            {socialLinks.telegram && (
              <Link
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                aria-label="Telegram"
              >
                <FaTelegram className="size-5" />
              </Link>
            )}
            {socialLinks.tiktok && (
              <Link
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                aria-label="TikTok"
              >
                <FaTiktok className="size-5" />
              </Link>
            )}
          </div>
        </div>
      )}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-eftah.png"
                alt="Eftah Logo"
                width={1000}
                height={1000}
                className="size-12 rounded-full"
              />
              <div>
                <p className="font-bold">Eftah Fast Food</p>
                <p className="text-sm text-gray-500">Est. 2024</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 mt-6">
                © {new Date().getFullYear()} Eftah Fast Food. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
