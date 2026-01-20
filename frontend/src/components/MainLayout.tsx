import React from 'react';
import { Header, Footer } from '../components/Layout';

interface PageProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<PageProps> = ({ children, title }) => {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} - ProdLens AI`;
    }
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
