/**
 * Page Container Component
 * 
 * A reusable container component for page content with consistent padding and max width.
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageContainer({
  children,
  className,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'container px-4 py-6 mx-auto',
        !fullWidth && 'max-w-6xl',
        className
      )}
    >
      {children}
    </div>
  );
}