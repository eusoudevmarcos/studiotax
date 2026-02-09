import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color-light)] pt-14">
      <Header />
      <main className="grow mx-auto w-full">{children}</main>
      <Footer />

      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
