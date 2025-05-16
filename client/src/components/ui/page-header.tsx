import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  gradientText?: string;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  gradientText, 
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
        {gradientText && (
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {' '}{gradientText}
          </span>
        )}
      </h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}