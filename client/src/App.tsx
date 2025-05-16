import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

// Direct imports of only essential components
import Home from './pages/home';
import NotFound from './pages/not-found';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          
          {/* Dynamic route handling for all page components */}
          <Route path="/:page*">
            {(params) => {
              const pagePath = params.page;
              
              // Home page special case
              if (!pagePath) {
                return <Home />;
              }
              
              try {
                // For routes like '/bridge' or '/cross-chain-bridge'
                let formattedPath = pagePath;
                
                // Convert URL like '/cross-chain-bridge' to a file path format
                // by converting from hyphenated paths to camelCase file names
                if (formattedPath.includes('-')) {
                  formattedPath = formattedPath.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                }
                
                // Dynamically import the requested page
                // Note: We need to use a static import pattern for Vite to recognize
                const Component = 
                  pagePath === 'bridge' ? require('./pages/cross-chain-bridge').default :
                  pagePath === 'cross-chain-bridge' ? require('./pages/cross-chain-bridge').default :
                  pagePath === 'create-vault' ? require('./pages/create-ton-vault').default :
                  pagePath === 'staking' ? require('./pages/cvt-staking').default :
                  pagePath === 'documentation' ? require('./pages/documentation').default :
                  pagePath === 'smart-contract-vault' ? require('./pages/smart-contract-vault').default :
                  pagePath === 'biometric-vault' ? require('./pages/biometric-vault').default :
                  pagePath === 'cross-chain-vault' ? require('./pages/cross-chain-vault').default :
                  pagePath === 'geo-vault' ? require('./pages/geo-vault').default :
                  pagePath === 'specialized-vault-memory' ? require('./pages/specialized-vault-memory').default :
                  pagePath === 'investment-discipline-vault' ? require('./pages/investment-discipline-vault').default :
                  pagePath === 'vault-school' ? require('./pages/vault-school').default :
                  pagePath === 'multi-signature-vault' ? require('./pages/multi-signature-vault').default :
                  pagePath === 'multi-signature-vault-new' ? require('./pages/multi-signature-vault-new').default :
                  pagePath === 'my-vaults' ? require('./pages/my-vaults').default :
                  pagePath === 'about' ? require('./pages/about').default :
                  pagePath === 'whitepaper' ? require('./pages/whitepaper').default :
                  pagePath === 'audit-test' ? require('./pages/audit-test').default :
                  pagePath === 'faq' ? require('./pages/faq').default :
                  null;
                  
                if (Component) {
                  return <Component />;
                } else {
                  // Try to import based on the exact file name
                  try {
                    const FallbackComponent = require(`./pages/${pagePath}`).default;
                    return <FallbackComponent />;
                  } catch (e) {
                    return <NotFound />;
                  }
                }
              } catch (error) {
                console.error("Error loading component:", error);
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