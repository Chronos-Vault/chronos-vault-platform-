import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// This is a lightweight layout that doesn't include Header/Footer 
// since those are already in the main Layout component
export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
