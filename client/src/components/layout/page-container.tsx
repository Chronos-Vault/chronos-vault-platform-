/**
 * PageContainer Component
 * 
 * A container component that provides consistent padding and max-width
 * for page content throughout the application.
 */

import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`container px-4 md:px-6 mx-auto py-6 max-w-6xl ${className}`}>
      {children}
    </main>
  );
}