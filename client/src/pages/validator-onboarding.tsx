import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Shield, Server, Cpu, CheckCircle2, AlertCircle, ArrowRight, ExternalLink, ChevronRight, Copy, Terminal } from 'lucide-react';

const registrationSchema = z.object({
  operatorName: z.string().min(2, 'Operator name is required'),
  operatorEmail: z.string().email('Valid email is required'),
  organizationName: z.string().optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/i, 'Valid Ethereum address required'),
  teeType: z.enum(['sgx', 'sev']),
  hardwareVendor: z.string().optional(),
  hardwareModel: z.string().min(1, 'Hardware model is required'),
  region: z.string().optional(),
  consensusRole: z.enum(['arbitrum', 'solana', 'ton']).optional()
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface Validator {
  id: number;
  operatorName: string;
  operatorEmail: string;
  walletAddress: string;
  status: string;
  teeType: string;
  hardwareModel: string | null;
  consensusRole: string | null;
  createdAt: string;
}

export default function ValidatorOnboardingPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [registeredValidator, setRegisteredValidator] = useState<Validator | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      operatorName: '',
      operatorEmail: '',
      organizationName: '',
      walletAddress: '',
      teeType: 'sgx',
      hardwareVendor: '',
      hardwareModel: '',
      region: '',
      consensusRole: undefined
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await apiRequest('POST', '/api/validators/register', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setRegisteredValidator(data.validator);
      setStep(2);
      toast({
        title: 'Registration Successful',
        description: 'Your validator has been registered. Proceed to hardware setup.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please check your details and try again.',
        variant: 'destructive'
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (validatorId: number) => {
      const response = await apiRequest('POST', `/api/validators/${validatorId}/submit`);
      return response.json();
    },
    onSuccess: () => {
      setStep(3);
      toast({
        title: 'Submitted for Review',
        description: 'Your validator is now pending attestation verification.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-10 w-10 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">Become a Trinity Validator</h1>
            </div>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join the Trinity Protocol network as a hardware-secured validator.
              Earn rewards while helping secure cross-chain operations with TEE-backed attestation.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <ChevronRight className={`h-5 w-5 mx-2 ${step > s ? 'text-cyan-400' : 'text-slate-600'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur" data-testid="card-registration-form">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-cyan-400" />
                  Validator Registration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Provide your operator details and hardware configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="operatorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Operator Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Your name or handle"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                data-testid="input-operator-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="operatorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email"
                                placeholder="operator@example.com"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                data-testid="input-operator-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Organization (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Company or DAO name"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                data-testid="input-organization-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="walletAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Validator Wallet Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="0x..."
                                className="bg-slate-800/50 border-slate-700 text-white font-mono"
                                data-testid="input-wallet-address"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-500">
                              This address will receive rewards and be used for attestation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t border-slate-800 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-cyan-400" />
                        Hardware Configuration
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="teeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">TEE Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white" data-testid="select-tee-type">
                                    <SelectValue placeholder="Select TEE type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sgx">Intel SGX</SelectItem>
                                  <SelectItem value="sev">AMD SEV-SNP</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-slate-500">
                                {field.value === 'sgx' 
                                  ? 'For Intel Xeon processors with SGX support' 
                                  : 'For AMD EPYC processors with SEV-SNP'}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hardwareVendor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">Hardware Vendor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white" data-testid="select-hardware-vendor">
                                    <SelectValue placeholder="Select vendor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="intel">Intel</SelectItem>
                                  <SelectItem value="amd">AMD</SelectItem>
                                  <SelectItem value="dell">Dell</SelectItem>
                                  <SelectItem value="hpe">HPE</SelectItem>
                                  <SelectItem value="supermicro">Supermicro</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hardwareModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">Hardware Model</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Xeon E-2388G or EPYC 7773X"
                                  className="bg-slate-800/50 border-slate-700 text-white"
                                  data-testid="input-hardware-model"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consensusRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">Consensus Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white" data-testid="select-consensus-role">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="arbitrum">Arbitrum (Primary Security)</SelectItem>
                                  <SelectItem value="solana">Solana (High-Frequency Monitor)</SelectItem>
                                  <SelectItem value="ton">TON (Emergency Recovery)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-slate-500">
                                Your validator's role in the 2-of-3 consensus
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">Region</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white" data-testid="select-region">
                                    <SelectValue placeholder="Select region" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="us-east">US East</SelectItem>
                                  <SelectItem value="us-west">US West</SelectItem>
                                  <SelectItem value="eu-central">EU Central</SelectItem>
                                  <SelectItem value="eu-west">EU West</SelectItem>
                                  <SelectItem value="asia-east">Asia East</SelectItem>
                                  <SelectItem value="asia-southeast">Asia Southeast</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={registerMutation.isPending}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                        data-testid="button-register"
                      >
                        {registerMutation.isPending ? 'Registering...' : 'Register Validator'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {step === 2 && registeredValidator && (
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur" data-testid="card-hardware-setup">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-cyan-400" />
                    Hardware Setup Instructions
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure your TEE hardware and generate attestation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-emerald-300 font-medium">Validator Registered</p>
                        <p className="text-slate-400 text-sm">ID: {registeredValidator.id}</p>
                        <p className="text-slate-400 text-sm font-mono">{registeredValidator.walletAddress}</p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue={registeredValidator.teeType || 'sgx'} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                      <TabsTrigger value="sgx">Intel SGX Setup</TabsTrigger>
                      <TabsTrigger value="sev">AMD SEV Setup</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="sgx" className="mt-4 space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">1. Install Intel SGX SDK</h4>
                        <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 relative">
                          <code>sudo apt-get install libsgx-enclave-common libsgx-urts</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 text-slate-400 hover:text-white"
                            onClick={() => copyToClipboard('sudo apt-get install libsgx-enclave-common libsgx-urts')}
                            data-testid="button-copy-sgx-install"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">2. Generate Attestation Quote</h4>
                        <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 relative">
                          <code>trinity-shield attest --wallet {registeredValidator.walletAddress}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 text-slate-400 hover:text-white"
                            onClick={() => copyToClipboard(`trinity-shield attest --wallet ${registeredValidator.walletAddress}`)}
                            data-testid="button-copy-attest-cmd"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">3. Verify MRENCLAVE</h4>
                        <p className="text-slate-400 text-sm mb-2">
                          Ensure your enclave measurement matches the official Trinity Shield enclave:
                        </p>
                        <div className="bg-slate-900 rounded p-3 font-mono text-xs text-cyan-400 break-all">
                          Expected MRENCLAVE: 0x7d3e...4f2a (see docs for full hash)
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sev" className="mt-4 space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">1. Enable SEV-SNP in BIOS</h4>
                        <p className="text-slate-400 text-sm">
                          Ensure SEV-SNP is enabled in your server's UEFI/BIOS settings under
                          AMD CBS → CPU Common → SEV-ES ASID Space Limit
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">2. Install SEV Tools</h4>
                        <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 relative">
                          <code>sudo apt-get install sev-tool sevctl</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 text-slate-400 hover:text-white"
                            onClick={() => copyToClipboard('sudo apt-get install sev-tool sevctl')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">3. Generate SEV Attestation</h4>
                        <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 relative">
                          <code>trinity-shield attest --sev --wallet {registeredValidator.walletAddress}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 text-slate-400 hover:text-white"
                            onClick={() => copyToClipboard(`trinity-shield attest --sev --wallet ${registeredValidator.walletAddress}`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      onClick={() => window.open('/docs/hardware-setup-guide', '_blank')}
                      data-testid="button-view-docs"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Full Hardware Guide
                    </Button>
                    <Button
                      className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                      onClick={() => submitMutation.mutate(registeredValidator.id)}
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-for-review"
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit for Attestation Review'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && registeredValidator && (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur" data-testid="card-pending-verification">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Attestation Pending
                </h2>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Your validator has been submitted for on-chain attestation verification.
                  This typically takes 5-10 minutes.
                </p>
                
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Validator ID</span>
                    <span className="text-white font-mono">{registeredValidator.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-slate-400">Status</span>
                    <span className="text-amber-400 font-medium">Attesting</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-slate-400">TEE Type</span>
                    <span className="text-white">{registeredValidator.teeType?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => navigate(`/validator-dashboard?id=${registeredValidator.id}`)}
                    data-testid="button-view-status"
                  >
                    View Status
                  </Button>
                  <Button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={() => navigate('/validator-dashboard')}
                    data-testid="button-go-to-dashboard"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Hardware Security</h3>
                <p className="text-slate-400 text-sm">
                  TEE-backed attestation ensures validator integrity with cryptographic proof
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Server className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">2-of-3 Consensus</h3>
                <p className="text-slate-400 text-sm">
                  Join the decentralized validator set securing cross-chain operations
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Earn Rewards</h3>
                <p className="text-slate-400 text-sm">
                  Receive CVT token rewards for successful consensus participation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
