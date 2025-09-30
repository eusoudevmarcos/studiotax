import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { ReactNode } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Studio Tax",
  description:
    "Consultoria tributária especializada em bares, restaurantes, cafés, mercados e açougues.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <Header />

        <main id="top" style={{}}>
          {children}
        </main>

        <Footer />

        <WhatsAppButton />
      </body>
    </html>
  );
}
