import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CodeIcon, 
  ShieldCheckIcon, 
  KeySquareIcon, 
  LockIcon,
  NetworkIcon,
  CheckCircleIcon,
  Copy,
  ExternalLink,
  AlertCircle,
  Zap,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/layout/page-header';

interface CodeExample {
  language: string;
  title: string;
  code: string;
}

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

interface IntegrationGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  codeExamples: CodeExample[];
  endpoints: Endpoint[];
}

interface SecurityLayer {
  id: string;
  layer: number;
  name: string;
  protocol: string;
  description: string;
  status: string;
  features: string[];
  apiEndpoint: string;
}

const SecurityIntegrationGuide = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: guidesData, isLoading: guidesLoading } = useQuery<{
    success: boolean;
    totalGuides: number;
    guides: IntegrationGuide[];
  }>({
    queryKey: ['/api/security-docs/integration-guides'],
  });

  const { data: layersData, isLoading: layersLoading } = useQuery<{
    success: boolean;
    totalLayers: number;
    layers: SecurityLayer[];
  }>({
    queryKey: ['/api/security-docs/layers'],
  });

  const isLoading = guidesLoading || layersLoading;
  const guides = guidesData?.guides || [];
  const layers = layersData?.layers || [];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'trinity-protocol': return <NetworkIcon className="w-6 h-6 text-[#FF5AF7]" />;
      case 'quantum-crypto': return <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />;
      case 'zk-proofs': return <Eye className="w-6 h-6 text-[#FF5AF7]" />;
      case 'mpc-keys': return <LockIcon className="w-6 h-6 text-[#FF5AF7]" />;
      case 'vdf-timelocks': return <Zap className="w-6 h-6 text-[#FF5AF7]" />;
      default: return <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Integration Guide"
        subtitle="Developer documentation for integrating Chronos Vault's Mathematical Defense Layer"
        icon={<CodeIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      {isLoading ? (
        <div className="space-y-6 mt-8">
          <Skeleton className="h-32 w-full bg-gray-800" />
          <Skeleton className="h-64 w-full bg-gray-800" />
        </div>
      ) : (
        <>
          <div className="mt-8 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Start Integration</h2>
            <p className="text-gray-400 mb-6">
              Integrate Chronos Vault's cryptographically proven security features into your application. 
              All code examples are from our <span className="text-[#50E3C2] font-semibold">production security modules</span>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {layers.slice(0, 4).map(layer => (
                <div key={layer.id} className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  {getLayerIcon(layer.id)}
                  <h3 className="text-lg font-semibold text-white mb-2 mt-2">{layer.name.split(' ')[0]}</h3>
                  <p className="text-sm text-gray-400">{layer.protocol}</p>
                  <Badge variant="outline" className="mt-2 text-xs">{layer.apiEndpoint}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue={guides[0]?.id || 'trinity-integration'} className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
              {guides.map(guide => (
                <TabsTrigger 
                  key={guide.id}
                  value={guide.id}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
                  data-testid={`tab-${guide.id}`}
                >
                  {guide.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {guides.map(guide => (
              <TabsContent key={guide.id} value={guide.id}>
                <div className="grid gap-6 mt-8">
                  <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white flex items-center gap-3">
                        <NetworkIcon className="w-6 h-6 text-[#FF5AF7]" />
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {guide.codeExamples.map((example, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-[#FF5AF7]">{example.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{example.language}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(example.code, `${guide.id}-${idx}`)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  {copiedCode === `${guide.id}-${idx}` ? (
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto">
                              <pre className="text-[#50E3C2] text-sm whitespace-pre-wrap">
                                {example.code}
                              </pre>
                            </div>
                          </div>
                        ))}

                        <div className="bg-[#111] p-4 rounded-lg border border-[#333] mt-6">
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-[#50E3C2]" />
                            API Endpoints
                          </h4>
                          <div className="space-y-2">
                            {guide.endpoints.map((endpoint, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <Badge className={endpoint.method === 'POST' ? 'bg-green-600' : 'bg-blue-600'}>
                                  {endpoint.method}
                                </Badge>
                                <code className="text-[#50E3C2]">{endpoint.path}</code>
                                <span className="text-gray-400">- {endpoint.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">All Security Layers API Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {layers.map(layer => (
                <Card key={layer.id} className="bg-[#1A1A1A] border border-[#333]">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-600/20 p-3 rounded-lg">
                        {getLayerIcon(layer.id)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{layer.name}</h3>
                          <Badge className="bg-purple-600">Layer {layer.layer}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{layer.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="text-[#50E3C2] border-[#50E3C2]">
                            {layer.protocol}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {layer.apiEndpoint}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Integrate?</h3>
              <p className="text-gray-400 mb-6">
                Start building secure applications with our comprehensive SDK and live API endpoints.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
                  <Link href="/smart-contract-sdk">
                    Smart Contract SDK
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">
                  <Link href="/api-documentation">
                    Full API Reference
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/security-tutorials">
                    Security Tutorials
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityIntegrationGuide;
