import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import MainLayout from "../layouts/MainLayout";
import { Toaster } from "../components/ui/sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
