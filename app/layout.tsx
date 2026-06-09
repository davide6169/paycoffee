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
      { url: "/images/paycoffee-icon.png", sizes: "57x57", type: "image/png" },
      { url: "/images/paycoffee-icon@2x.png", sizes: "114x114", type: "image/png" },
    ],
    apple: [
      { url: "/images/paycoffee-icon.png", sizes: "57x57", type: "image/png" },
      { url: "/images/paycoffee-icon@2x.png", sizes: "114x114", type: "image/png" },
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
        <link rel="icon" type="image/png" sizes="32x32" href="/images/paycoffee-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/paycoffee-icon@2x.png" />
        <link rel="apple-touch-icon" href="/images/paycoffee-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
