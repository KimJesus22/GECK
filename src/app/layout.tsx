import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import MainContent from "@/components/MainContent";
import AxeCoreProvider from "@/components/AxeCoreProvider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "INGENIA BASE — Plataforma de Conocimiento Corporativo",
  description:
    "INGENIA BASE: plataforma corporativa de capacitación y gestión de conocimiento empresarial.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} antialiased`}
      >
        <Toaster 
          theme="dark" 
          toastOptions={{
            style: {
              background: '#0d1117',
              border: '1px solid rgba(57, 255, 20, 0.2)',
              color: '#39ff14',
              fontFamily: 'var(--font-jetbrains)',
              borderRadius: '0px',
            }
          }} 
        />
        <AxeCoreProvider>
          <ConditionalSidebar />
          <MainContent>{children}</MainContent>
        </AxeCoreProvider>
      </body>
    </html>
  );
}
