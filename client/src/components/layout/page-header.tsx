import React, { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;  // Added for tutorial pages
  icon?: ReactNode;   // Added for tutorial pages
  actions?: ReactNode;
  backButton?: boolean;
  backTo?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonText?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  icon,
  actions,
  backButton = false,
  backTo = '',
  showCreateButton = false,
  onCreateClick,
  createButtonText = 'Create New',
  className = '',
}) => {
  const [, navigate] = useLocation();

  const handleBackClick = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      window.history.back();
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col space-y-2">
          {backButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-fit -ml-3 mb-1" 
              onClick={handleBackClick}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-lg font-medium">{subtitle}</p>
          )}
          {description && (
            <p className="text-muted-foreground text-sm md:text-base">{description}</p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 space-x-2 flex items-center">
          {showCreateButton && (
            <Button 
              onClick={onCreateClick} 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white"
            >
              <Plus className="mr-1 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;