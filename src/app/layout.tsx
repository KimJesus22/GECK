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
  title: {
    template: "%s | INGENIA BASE",
    default: "INGENIA BASE — Plataforma de Conocimiento Corporativo",
  },
  description:
    "Plataforma segura para el almacenamiento y organización de documentos universitarios y corporativos.",
  openGraph: {
    title: "INGENIA BASE - Bóveda de Gestión Documental",
    description:
      "Plataforma segura para el almacenamiento y organización de documentos universitarios y corporativos.",
    url: "https://geck-beige.vercel.app/",
    siteName: "INGENIA BASE",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INGENIA BASE - Bóveda de Gestión Documental",
    description:
      "Plataforma segura para el almacenamiento y organización de documentos universitarios y corporativos.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
