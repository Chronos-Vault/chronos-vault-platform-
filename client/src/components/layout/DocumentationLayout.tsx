import React from 'react';
import MainHeader from './MainHeader';
import Footer from './footer';

export interface DocumentationLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  subtitle?: string;
  icon?: string;
  cta?: React.ReactNode;
}

/**
 * A simplified layout component for documentation pages
 * that doesn't require onboarding context
 */
const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children, 
  title, 
  description, 
  subtitle, 
  icon, 
  cta 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* We're using the standard MainHeader here, 
         with a special class that will hide it when inside a Layout component */}
      <div className="doc-only-header">
        <MainHeader />
      </div>
      <main className="flex-1">
        {(title || description) && (
          <div className="bg-card px-4 pt-20 pb-12 border-b">
            <div className="container mx-auto max-w-6xl">
              {icon && <div className="text-4xl mb-4">{icon}</div>}
              {title && <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>}
              {subtitle && <p className="text-xl text-indigo-400 mb-3">{subtitle}</p>}
              {description && <p className="text-xl text-muted-foreground max-w-3xl">{description}</p>}
              {cta}
            </div>
          </div>
        )}
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationLayout;