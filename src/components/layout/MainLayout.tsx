'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    isAdmin: boolean;
  } | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 