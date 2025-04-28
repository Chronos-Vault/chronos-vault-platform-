import React from 'react';
import { PrivacyDashboard } from '@/components/privacy';
import { useLocation } from 'wouter';

export default function PrivacyDashboardPage() {
  const [location] = useLocation();
  
  // Extract vault ID from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const vaultId = params.get('vaultId') || undefined;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <PrivacyDashboard vaultId={vaultId} />
    </div>
  );
}