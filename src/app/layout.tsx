import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "./globals.css";
import BootstrapClient from "@/components/common/BootstrapClient";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Delivery System",
  description: "Multi-restaurant food delivery",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e88e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Delivery" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <BootstrapClient />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
