import React, { useEffect, useState, Suspense } from 'react';
import DocumentationLayout from '@/components/layout/DocumentationLayout';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

interface DocumentationRouterProps {
  vaultType: string;
}

const DocumentationRouter: React.FC<DocumentationRouterProps> = ({ vaultType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Load the documentation component dynamically based on the vault type
    const loadComponent = async () => {
      try {
        // Use dynamic import to load the component
        const module = await import(`@/pages/documentation/${vaultType}`);
        setComponent(() => module.default);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error loading documentation for ${vaultType}:`, error);
        setIsLoading(false);
      }
    };

    loadComponent();
  }, [vaultType]);
  
  if (isLoading) {
    return (
      <DocumentationLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#FF5AF7]" />
        </div>
      </DocumentationLayout>
    );
  }

  if (Component) {
    return <Component />;
  }

  // Fallback if component doesn't exist
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Documentation Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, we couldn't find documentation for '{vaultType}'. Please check the URL or return to the Vault School Hub.
        </p>
        <button 
          onClick={() => setLocation('/vault-school-hub')} 
          className="px-4 py-2 bg-[#FF5AF7] text-white rounded-md hover:bg-[#E047D9] transition-colors"
        >
          Back to Vault School Hub
        </button>
      </div>
    </DocumentationLayout>
  );
};

export default DocumentationRouter;