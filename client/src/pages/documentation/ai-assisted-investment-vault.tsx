import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  LineChart, 
  BrainCog, 
  BarChart4, 
  Activity,
  Bot, 
  Layers, 
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AIAssistedInvestmentVaultDocumentation() {
  return (
    <DocumentationLayout
      title="AI-Assisted Investment Vault"
      description="AI-powered market analysis for optimal trading decisions"
      icon="🤖"
      cta={
        <Link href="/create-vault/ai-investment">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-blue-500 to-purple-400 hover:from-blue-400 hover:to-purple-300">
            Create AI Investment Vault <MoveRight className="size-4" />
          </Button>
        </Link>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">AI-Powered Market Intelligence</h2>
            <p className="text-lg text-muted-foreground">
              The AI-Assisted Investment Vault combines cutting-edge artificial intelligence with 
              secure blockchain technology to help you make smarter, more informed investment 
              decisions across multiple asset classes and market conditions.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <BrainCog className="size-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Advanced Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  Our proprietary AI models analyze millions of market data points to identify patterns 
                  and trends that human analysts might miss, helping you anticipate market movements.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <BarChart4 className="size-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Portfolio Optimization</h3>
                <p className="text-muted-foreground">
                  Receive AI-generated portfolio recommendations tailored to your risk tolerance,
                  investment goals, and market conditions, with automated rebalancing suggestions.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Activity className="size-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Sentiment Analysis Integration</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes market sentiment across social media, news sources, and analyst reports
                  to provide a comprehensive view of market psychology and potential impacts.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Lock className="size-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Asset Protection</h3>
                <p className="text-muted-foreground">
                  All investment assets remain securely stored in your vault with our Triple-Chain Security™ 
                  protocols, combining AI insights with uncompromising blockchain security.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-Assisted Investment Vault includes a powerful suite of features designed to enhance your 
              investment strategy with advanced artificial intelligence while maintaining the highest level 
              of security and control over your assets.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BrainCog className="mr-3 text-blue-500" />
                  AI-Powered Market Analysis
                </h3>
                <p className="text-muted-foreground mb-4">
                  Leverage sophisticated machine learning for data-driven insights:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Deep learning models trained on decades of market data
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Real-time pattern recognition across multiple time frames
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Anomaly detection to identify unusual market behavior
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Correlation analysis between different assets and market sectors
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Bot className="mr-3 text-blue-500" />
                  Personalized Investment Strategies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tailored recommendations based on your unique profile:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Risk tolerance assessment and dynamic adaptation
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Investment timeline consideration with milestone planning
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Goal-based strategy development and tracking
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Behavioral finance integration to overcome emotional biases
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <LineChart className="mr-3 text-blue-500" />
                  Advanced Trading Signals
                </h3>
                <p className="text-muted-foreground mb-4">
                  Receive timely and actionable investment insights:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Entry and exit point recommendations based on AI analysis
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Position sizing suggestions based on risk parameters
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Stop-loss and take-profit level optimization
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Market regime detection for strategy switching
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Activity className="mr-3 text-blue-500" />
                  Multi-Source Sentiment Analysis
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive market sentiment monitoring:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Social media trend analysis across major platforms
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Natural language processing of financial news
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Analyst report sentiment extraction and summarization
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Contrarian indicators to identify market extremes
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Layers className="mr-3 text-blue-500" />
                  Secure Asset Management
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete security for your investment assets:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Triple-Chain Security™ for distributed risk protection
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Optional time-locked deposits for disciplined investing
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Risk-based security level adjustment for different assets
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> 
                    Emergency access protocols with multi-factor authentication
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Advanced Security Architecture</h2>
            <p className="text-lg text-muted-foreground">
              The AI-Assisted Investment Vault combines our renowned blockchain security with 
              specialized protections for AI systems and financial data, creating a uniquely secure 
              environment for your investment assets and strategy information.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-blue-700 dark:text-blue-400">
                All investment assets in your AI-Assisted Vault are secured with our revolutionary
                Triple-Chain Security™ protocol, distributing security verification across three
                distinct blockchain networks with additional AI monitoring for anomalous activity detection.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">AI-Model Security</h3>
                <p className="text-muted-foreground">
                  Our AI models are secured with federated learning techniques to ensure that your personal 
                  financial data never leaves your secure environment while still benefiting from the collective 
                  intelligence of our model training.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Adversarial Defense System</h3>
                <p className="text-muted-foreground">
                  Advanced protection against model manipulation attempts through continuous adversarial 
                  testing and robust model verification to prevent malicious inputs from influencing 
                  investment recommendations.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Financial Data Encryption</h3>
                <p className="text-muted-foreground">
                  All financial and portfolio data is protected with quantum-resistant encryption both 
                  at rest and in transit, with a zero-knowledge architecture that prevents even our own 
                  systems from accessing your complete financial profile.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Recommendation Verification</h3>
                <p className="text-muted-foreground">
                  Each investment recommendation undergoes a multi-stage verification process through 
                  separate AI models and risk assessment systems to ensure consistency and prevent 
                  outlier recommendations from reaching you.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The AI-Assisted Investment Vault employs state-of-the-art machine learning algorithms, 
              secure data processing pipelines, and blockchain integration technologies to create a 
              powerful yet secure investment intelligence platform.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">AI Architecture</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Core Models:</h4>
                    <p className="text-muted-foreground">Ensemble of transformer-based prediction networks, recurrent neural networks, and gradient-boosted decision trees</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Training Dataset:</h4>
                    <p className="text-muted-foreground">Historical market data across 15+ years, 50+ asset classes, and multiple market cycles</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Update Frequency:</h4>
                    <p className="text-muted-foreground">Models retrained daily on incremental data with full retraining monthly</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Explainability Layer:</h4>
                    <p className="text-muted-foreground">LIME and SHAP integration for transparent decision attribution and recommendation explanation</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Data Processing Pipeline</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Market Data Sources:</h4>
                    <p className="text-muted-foreground">25+ financial data providers with cross-verification and anomaly detection</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sentiment Analysis:</h4>
                    <p className="text-muted-foreground">NLP processing of 100K+ daily news articles, social posts, and financial reports</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Technical Indicators:</h4>
                    <p className="text-muted-foreground">Real-time calculation of 200+ technical indicators with adaptive parameter optimization</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">On-Chain Analytics:</h4>
                    <p className="text-muted-foreground">Blockchain transaction analysis for crypto assets with whale movement detection</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Blockchain Integration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Smart Contract Architecture:</h4>
                    <p className="text-muted-foreground">ERC-4626 compliant vault with enhanced security features and AI integration hooks</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cross-Chain Compatibility:</h4>
                    <p className="text-muted-foreground">Supports assets on Ethereum, Solana, TON, and Bitcoin with cross-chain bridges</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Oracle Integration:</h4>
                    <p className="text-muted-foreground">Chainlink Price Feeds for reliable price data with multi-oracle verification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Security Protocols:</h4>
                    <p className="text-muted-foreground">Multi-signature authorization for AI-suggested trades with configurable approval thresholds</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Prediction Accuracy:</h4>
                    <p className="text-muted-foreground">68-74% directional accuracy for major market movements (based on backtesting)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Latency:</h4>
                    <p className="text-muted-foreground">Under 500ms for standard analysis, 2-5 seconds for complex multi-factor analysis</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Strategy Performance:</h4>
                    <p className="text-muted-foreground">Historical outperformance of 3-8% annually versus passive index strategies (varies by market conditions)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Risk Management:</h4>
                    <p className="text-muted-foreground">Demonstrated 15-30% reduction in maximum drawdown compared to non-AI strategies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Common questions about our AI-Assisted Investment Vault and how it can enhance your investment strategy.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">How does the AI make investment recommendations?</h3>
                <p className="text-muted-foreground">
                  Our AI system uses a combination of several advanced approaches to generate investment recommendations:
                  <br /><br />
                  1. Historical Pattern Analysis: The system identifies patterns in historical market data that have preceded specific price movements in the past.
                  <br /><br />
                  2. Fundamental Analysis: The AI processes company financial reports, economic indicators, and other fundamental data to assess intrinsic value.
                  <br /><br />
                  3. Sentiment Analysis: Advanced NLP algorithms analyze news articles, social media, and analyst reports to gauge market sentiment around specific assets.
                  <br /><br />
                  4. Technical Indicator Optimization: The system calculates hundreds of technical indicators and dynamically determines which ones have the highest predictive power in current market conditions.
                  <br /><br />
                  Each recommendation comes with an explanation of the key factors that influenced the AI's decision, allowing you to understand the reasoning behind every suggestion.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">Do I maintain control over my investment decisions?</h3>
                <p className="text-muted-foreground">
                  Absolutely. The AI-Assisted Investment Vault is designed to enhance your decision-making, not replace it. You have several control options:
                  <br /><br />
                  • Advisory Mode: The default setting where the AI provides recommendations, but you make all final decisions on executing trades.
                  <br /><br />
                  • Semi-Automated Mode: You can pre-approve certain types of trades within specific parameters, but still approve any recommendations outside those boundaries.
                  <br /><br />
                  • Fully-Managed Mode: For experienced users, you can authorize the AI to execute trades automatically based on your pre-defined strategy and risk parameters.
                  <br /><br />
                  You can change your control mode at any time, and you always retain the ability to override AI decisions, implement your own trades, or withdraw your assets.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">How does the system protect against market volatility and crashes?</h3>
                <p className="text-muted-foreground">
                  The AI-Assisted Investment Vault includes several protective mechanisms specifically designed to manage market volatility:
                  <br /><br />
                  1. Volatility Prediction: Our models specifically track market volatility indicators and can anticipate periods of increased turbulence.
                  <br /><br />
                  2. Dynamic Risk Adjustment: As volatility increases, the system automatically adjusts position sizes and risk exposure.
                  <br /><br />
                  3. Drawdown Protection: You can set maximum drawdown limits that will trigger protective measures like increasing cash positions or implementing hedges.
                  <br /><br />
                  4. Sector Rotation: The AI can shift allocations between sectors based on which areas show greater stability during market stress.
                  <br /><br />
                  5. Black Swan Detection: Specialized algorithms monitor for unusual market conditions that could indicate a major market event, triggering enhanced protective measures.
                  <br /><br />
                  These protections have historically reduced maximum drawdowns by 15-30% compared to standard investment approaches during major market corrections.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">What types of assets can the AI provide analysis for?</h3>
                <p className="text-muted-foreground">
                  Our AI system is trained to analyze and provide recommendations across a comprehensive range of asset types:
                  <br /><br />
                  • Cryptocurrencies: Bitcoin, Ethereum, and 100+ major altcoins
                  <br />
                  • Stocks: Global coverage with emphasis on US, European, and Asian markets
                  <br />
                  • ETFs: Major index, sector, commodity, and specialized strategy ETFs
                  <br />
                  • Commodities: Direct and derivative instruments for major commodities
                  <br />
                  • Fixed Income: Government bonds, corporate bonds, and yield-generating alternatives
                  <br />
                  • Alternative Assets: REITs, selected NFTs, and tokenized real-world assets
                  <br /><br />
                  The system can analyze both individual assets and portfolio-level allocations, providing recommendations that consider the interactions between different assets in your portfolio.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">How is my financial and personal data protected?</h3>
                <p className="text-muted-foreground">
                  We implement multiple layers of protection for your sensitive data:
                  <br /><br />
                  1. Zero-Knowledge Architecture: Our system is designed so that your complete financial profile is never accessible in its entirety to any single part of the system.
                  <br /><br />
                  2. Federated Learning: AI models are trained without your personal data ever leaving your secure environment. Only model updates are shared, not your data.
                  <br /><br />
                  3. End-to-End Encryption: All data is encrypted both at rest and in transit using quantum-resistant encryption algorithms.
                  <br /><br />
                  4. Distributed Storage: Critical information is fragmented and stored across multiple blockchain networks through our Triple-Chain Security™ protocol.
                  <br /><br />
                  5. Strict Access Controls: Multi-factor authentication and biometric verification are required for any data access operations.
                  <br /><br />
                  Additionally, we undergo regular third-party security audits and penetration testing to ensure that our security measures remain at the forefront of industry standards.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">Can I customize the AI's strategy to match my investment philosophy?</h3>
                <p className="text-muted-foreground">
                  Yes, the AI-Assisted Investment Vault offers extensive customization options:
                  <br /><br />
                  • Investment Philosophy: Configure the AI to align with your preferred approach (value investing, growth investing, momentum strategies, etc.)
                  <br /><br />
                  • Risk Tolerance: Set precise risk parameters that determine position sizing and portfolio allocation
                  <br /><br />
                  • Ethical Guidelines: Exclude specific industries or companies that don't align with your values, or emphasize ESG considerations
                  <br /><br />
                  • Time Horizon: Adjust analysis to focus on your specific investment timeframe, from short-term to multi-decade planning
                  <br /><br />
                  • Tax Efficiency: Incorporate tax considerations into recommendations based on your jurisdiction and tax situation
                  <br /><br />
                  The system also allows you to "train" it over time by providing feedback on recommendations, gradually refining its understanding of your preferences and improving the relevance of its suggestions.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}