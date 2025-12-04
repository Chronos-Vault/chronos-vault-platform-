import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRightIcon, 
  BookOpenIcon, 
  ShieldCheckIcon, 
  KeySquareIcon, 
  UsersIcon, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Zap,
  Globe,
  Timer
} from 'lucide-react';
import PageHeader from '@/components/layout/page-header';

interface TutorialStep {
  step: number;
  title: string;
  content: string;
}

interface Tutorial {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  topics: string[];
  steps: TutorialStep[];
  relatedEndpoint: string;
}

interface TutorialsResponse {
  success: boolean;
  totalTutorials: number;
  categories: string[];
  tutorials: Tutorial[];
}

const categoryIcons: Record<string, JSX.Element> = {
  authentication: <ShieldCheckIcon className="w-5 h-5" />,
  encryption: <KeySquareIcon className="w-5 h-5" />,
  recovery: <UsersIcon className="w-5 h-5" />,
  'multi-chain': <Globe className="w-5 h-5" />,
  'time-locks': <Timer className="w-5 h-5" />,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

const SecurityTutorials = () => {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<TutorialsResponse>({
    queryKey: ['/api/security-docs/tutorials'],
  });

  const tutorials = data?.tutorials || [];
  const categories = data?.categories || [];
  
  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  const renderTutorialCard = (tutorial: Tutorial) => {
    const isExpanded = expandedTutorial === tutorial.id;
    
    return (
      <Card 
        key={tutorial.id} 
        className={`bg-[#1A1A1A] border border-[#333] shadow-xl transition-all duration-300 ${
          isExpanded ? 'ring-2 ring-[#FF5AF7]/50' : ''
        }`}
        data-testid={`tutorial-${tutorial.id}`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                {categoryIcons[tutorial.category] || <BookOpenIcon className="w-5 h-5 text-[#FF5AF7]" />}
              </div>
              <div>
                <CardTitle className="text-xl text-white">{tutorial.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={difficultyColors[tutorial.difficulty]}>
                    {tutorial.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {tutorial.duration}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedTutorial(isExpanded ? null : tutorial.id)}
              className="text-[#FF5AF7]"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          <CardDescription className="text-gray-400 mt-2">
            {tutorial.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-gray-300">
          <div className="flex flex-wrap gap-2 mb-4">
            {tutorial.topics.map((topic, idx) => (
              <Badge key={idx} variant="outline" className="text-[#50E3C2] border-[#50E3C2]/50">
                {topic}
              </Badge>
            ))}
          </div>
          
          {isExpanded && (
            <div className="space-y-4 mt-6 border-t border-[#333] pt-6">
              <h3 className="text-lg font-semibold text-[#FF5AF7]">Step-by-Step Guide</h3>
              {tutorial.steps.map((step) => (
                <div key={step.step} className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#FF5AF7]/20 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-[#FF5AF7] font-bold">{step.step}</span>
                    </div>
                    <h4 className="text-lg font-medium text-white">{step.title}</h4>
                  </div>
                  <p className="text-gray-400 ml-11">{step.content}</p>
                </div>
              ))}
              
              <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] mt-4">
                <p className="text-xs text-gray-500">Related API Endpoint:</p>
                <code className="text-sm text-[#50E3C2]">{tutorial.relatedEndpoint}</code>
              </div>
            </div>
          )}
        </CardContent>
        
        {!isExpanded && (
          <CardFooter className="border-t border-[#333]">
            <Button 
              onClick={() => setExpandedTutorial(tutorial.id)}
              className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            >
              Start Tutorial
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Feature Tutorials"
        subtitle="Learn how to use our advanced security features to protect your digital assets"
        icon={<BookOpenIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      {isLoading ? (
        <div className="space-y-4 mt-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full bg-gray-800" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Failed to load tutorials. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 mt-8 flex-wrap">
            <Badge className="bg-purple-600 text-white px-4 py-1.5">
              {data?.totalTutorials} Tutorials Available
            </Badge>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-[#FF5AF7]' : ''}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'bg-[#FF5AF7]' : ''}
                >
                  {categoryIcons[cat]}
                  <span className="ml-1 capitalize">{cat.replace('-', ' ')}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 mt-6">
            {filteredTutorials.map(tutorial => renderTutorialCard(tutorial))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tutorials found for this category.</p>
            </div>
          )}

          <div className="mt-12 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Need More Help?</h3>
            <p className="text-gray-400 mb-6">
              Explore our comprehensive security documentation or get hands-on with our integration guides.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
                <Link href="/military-grade-security">
                  Security Architecture
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">
                <Link href="/security-integration-guide">
                  Developer Integration Guide
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/smart-contract-sdk">
                  Smart Contract SDK
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityTutorials;
