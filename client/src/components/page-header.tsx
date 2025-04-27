import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  description?: string;
  separator?: boolean;
  className?: string;
}

export const PageHeader = ({
  heading,
  description,
  separator = false,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-2">
        {heading}
      </h1>
      
      {description && (
        <p className="text-lg text-foreground/70 max-w-prose">
          {description}
        </p>
      )}
      
      {separator && (
        <div className="mt-4 mb-2 border-b border-border" />
      )}
    </div>
  );
};