import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Clock, File, KeyRound, Users } from 'lucide-react';

const CreateVaultWorking = () => {
  const [_, navigate] = useLocation();

  const vaultTypes = [
    {
      id: 'standard',
      name: 'Standard Time Vault',
      description: 'Lock assets until a specific date and time in the future',
      icon: <Clock className="h-6 w-6 text-primary" />
    },
    {
      id: 'multi-signature',
      name: 'Multi-Signature Vault',
      description: 'Require multiple signatures to access the vault',
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      id: 'biometric',
      name: 'Biometric Vault',
      description: 'Add biometric verification for advanced security',
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      id: 'smart-contract',
      name: 'Smart Contract Vault',
      description: 'Customizable logic for conditional asset releases',
      icon: <File className="h-6 w-6 text-primary" />
    },
    {
      id: 'geo-locked',
      name: 'Geo-Locked Vault',
      description: 'Add geographic location as an unlock condition',
      icon: <KeyRound className="h-6 w-6 text-primary" />
    }
  ];

  const handleSelectVaultType = (vaultType: string) => {
    // Navigate based on vault type
    switch(vaultType) {
      case 'multi-signature':
        navigate('/multi-signature-vault');
        break;
      case 'biometric':
        navigate('/biometric-vault');
        break;
      case 'smart-contract':
        navigate('/smart-contract-vault');
        break;
      case 'geo-locked':
        navigate('/geo-vault');
        break;
      default:
        navigate('/create-ton-vault');
        break;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
        Create Your Secure Time Vault
      </h1>
      <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
        Choose a vault type to begin. Each type offers different security features and unlocking mechanisms.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaultTypes.map((type) => (
          <Card key={type.id} className="hover:border-primary transition-all cursor-pointer hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {type.icon} {type.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{type.description}</p>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => handleSelectVaultType(type.id)}
              >
                Select This Vault
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CreateVaultWorking;