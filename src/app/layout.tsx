import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import MainLayout from "../layouts/MainLayout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
