/**
 * Page Header Component
 * 
 * A reusable page header component that displays a title, description, and optional icon.
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  align = 'left',
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 mb-2',
          align === 'center' && 'justify-center'
        )}
      >
        {icon}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}