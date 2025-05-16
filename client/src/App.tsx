import { Route, Switch } from 'wouter';
import Home from './pages/home';
import NotFound from './pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          {/* Main pages */}
          <Route path="/" component={Home} />
          
          {/* Let's dynamically load all other page routes */}
          <Route path="/:page*">
            {(params) => {
              const page = params.page;
              
              // Only show homepage for root path
              if (!page) return <Home />;
              
              try {
                // Try to dynamically load the requested page component
                const PageComponent = require(`./pages/${page}`).default;
                return <PageComponent />;
              } catch (error) {
                // If page doesn't exist, show the NotFound component
                return <NotFound />;
              }
            }}
          </Route>
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;