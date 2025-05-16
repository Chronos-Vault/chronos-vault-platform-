import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';

// Base pages
import Home from './pages/home';
import NotFound from './pages/not-found';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          
          {/* DYNAMICALLY LOAD ALL PAGES BY URL */}
          <Route path="/:pagePath+">
            {(params) => <DynamicPageLoader pagePath={params.pagePath} />}
          </Route>
          
          {/* 404 handler - Must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

// This component dynamically loads pages based on URL paths
const DynamicPageLoader = ({ pagePath }: { pagePath: string }) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    // Map common route aliases
    const routeMap: Record<string, string> = {
      'bridge': 'cross-chain-bridge',
    };

    const loadComponent = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Get the mapped path or use the original
        const mappedPath = routeMap[pagePath] || pagePath;
        
        // Use dynamic import to load the component
        const module = await import(`./pages/${mappedPath}`);
        setComponent(() => module.default);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading page for path /${pagePath}:`, err);
        
        // Try with legacy naming conventions
        try {
          // Try alternate formats like "page-name-page.tsx" if "page-name.tsx" fails
          const altPath = `${pagePath}-page`;
          const module = await import(`./pages/${altPath}`);
          setComponent(() => module.default);
          setLoading(false);
        } catch (altErr) {
          console.error(`Error loading alternate path /${pagePath}-page:`, altErr);
          setError(true);
          setLoading(false);
        }
      }
    };

    loadComponent();
  }, [pagePath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !Component) {
    return <NotFound />;
  }

  return <Component />;
};

export default App;