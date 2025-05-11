/**
 * Page Title Component
 * 
 * A standardized page title component with gradient text support.
 */

import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  gradientText?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  gradientText,
  className = '',
}) => {
  // Process the title to replace the gradient text if specified
  const renderTitle = () => {
    if (!gradientText || !title.includes(gradientText)) {
      return <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>;
    }

    const parts = title.split(gradientText);
    
    return (
      <h1 className="text-4xl font-extrabold tracking-tight flex flex-wrap">
        {parts[0]}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 ml-2 mr-2">
          {gradientText}
        </span>
        {parts[1]}
      </h1>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {renderTitle()}
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;