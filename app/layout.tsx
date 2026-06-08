import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayCoffee - Coffee Payment Tracker",
  description: "Track coffee payments and credits among friends. A web replica of the classic iOS PayCoffee app.",
  keywords: ["coffee", "payment", "tracker", "credits", "paycoffee", "ios"],
  authors: [{ name: "PayCoffee" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PayCoffee",
  },
  icons: {
    icon: [
      { url: "/images/coffee-cup.png", sizes: "28x28", type: "image/png" },
      { url: "/images/coffee-cup.png", sizes: "96x96", type: "image/png" },
      { url: "/images/coffee-cup.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/coffee-cup.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/coffee-cup.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/coffee-cup.png" />
        <link rel="apple-touch-icon" href="/images/coffee-cup.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
