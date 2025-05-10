import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  'full': 'max-w-full'
};

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = 'xl'
}) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;