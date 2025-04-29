import React from 'react';

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
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl font-poppins bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
        {heading}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl font-poppins font-light">
          {description}
        </p>
      )}
      {separator && <div className="h-[1px] w-full mt-4 bg-gradient-to-r from-[#6B00D7]/50 to-[#FF5AF7]/50"></div>}
    </div>
  );
};
