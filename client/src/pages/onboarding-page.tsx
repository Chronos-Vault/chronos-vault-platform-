import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { OnboardingProvider } from '@/hooks/use-onboarding';

export default function OnboardingPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </div>
  );
}