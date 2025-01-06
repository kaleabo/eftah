import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from "sonner";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eftah Burger & Fast Food | Addis Ababa, Ethiopia",
  description:
    "Experience the finest burgers, pizzas and fast food in Addis Ababa. Fresh ingredients, amazing taste, and quick delivery. Order now for your events and gatherings!",
  keywords: [
    "burger",
    "pizza", 
    "fast food",
    "delivery",
    "addis ababa",
    "ethiopia",
    "restaurant",
    "catering",
    "events",
  ],
  authors: [{ name: "Eftah Fast Food" }],
  creator: "Eftah Fast Food",
  publisher: "Eftah Fast Food",
  icons: {
    icon: "favicon.png",
    shortcut: "favicon.png",
    apple: "favicon.png",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eftahfastfood.com",
    title: "Eftah Burger & Fast Food | Addis Ababa, Ethiopia",
    description:
      "Experience the finest burgers, pizzas and fast food in Addis Ababa. Fresh ingredients, amazing taste, and quick delivery.",
    siteName: "Eftah Fast Food",
    images: [
      {
        url: "/og-image.png",

        width: 1200,
        height: 630,
        alt: "Eftah Fast Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eftah Burger & Fast Food | Addis Ababa, Ethiopia",
    description:
      "Experience the finest burgers, pizzas and fast food in Addis Ababa. Fresh ingredients, amazing taste, and quick delivery.",
    images: ["/images/hero/image-1.jpg"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
      <NextTopLoader 
        color="#FF0000"
        height={3}
        showSpinner={false}
      />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
