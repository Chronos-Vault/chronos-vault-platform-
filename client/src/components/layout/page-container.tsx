/**
 * Page Container Component
 * 
 * A consistent container component for pages throughout the application
 * with consistent padding and width constraints.
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'container';
}

export function PageContainer({
  children,
  className,
  maxWidth = 'container',
}: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
    container: 'max-w-7xl',
  }[maxWidth];

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidthClass, className)}>
      {children}
    </div>
  );
}