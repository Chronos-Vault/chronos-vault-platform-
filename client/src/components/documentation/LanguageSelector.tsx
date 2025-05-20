import React from 'react';
import { Button } from "@/components/ui/button";

type LanguageSelectorProps = {
  selectedLanguage: string;
  setSelectedLanguage: (language: 'javascript' | 'python' | 'java' | 'go' | 'rust') => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  setSelectedLanguage 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
        onClick={() => setSelectedLanguage('javascript')}
        size="sm"
        className="flex-grow sm:flex-grow-0"
      >
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">JavaScript</span>
          <span className="sm:hidden">JS</span>
        </span>
      </Button>
      <Button
        variant={selectedLanguage === 'python' ? 'default' : 'outline'}
        onClick={() => setSelectedLanguage('python')}
        size="sm"
        className="flex-grow sm:flex-grow-0"
      >
        <span className="flex items-center gap-2">Python</span>
      </Button>
      <Button
        variant={selectedLanguage === 'java' ? 'default' : 'outline'}
        onClick={() => setSelectedLanguage('java')}
        size="sm"
        className="flex-grow sm:flex-grow-0"
      >
        <span className="flex items-center gap-2">Java</span>
      </Button>
      <Button
        variant={selectedLanguage === 'go' ? 'default' : 'outline'}
        onClick={() => setSelectedLanguage('go')}
        size="sm"
        className="flex-grow sm:flex-grow-0"
      >
        <span className="flex items-center gap-2">Go</span>
      </Button>
      <Button
        variant={selectedLanguage === 'rust' ? 'default' : 'outline'}
        onClick={() => setSelectedLanguage('rust')}
        size="sm"
        className="flex-grow sm:flex-grow-0"
      >
        <span className="flex items-center gap-2">Rust</span>
      </Button>
    </div>
  );
};

export default LanguageSelector;