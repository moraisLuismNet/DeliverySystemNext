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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
