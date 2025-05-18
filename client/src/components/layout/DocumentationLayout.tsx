import React from 'react';
import MainHeader from './MainHeader';
import Footer from './footer';

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

/**
 * A simplified layout component for documentation pages
 * that doesn't require onboarding context
 */
const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationLayout;