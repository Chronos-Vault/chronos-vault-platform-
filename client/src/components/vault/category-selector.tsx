import React from 'react';
import { Motion } from '../../components/ui/motion';

export interface VaultCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CategorySelectorProps {
  categories: VaultCategory[];
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {categories.map((category, index) => (
        <Motion.div
          key={category.id}
          className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
            activeCategory === category.id
              ? 'ring-2 ring-opacity-70 shadow-lg'
              : 'hover:shadow-md'
          }`}
          style={{
            background: `linear-gradient(135deg, ${category.color}15 0%, rgba(0,0,0,0.6) 100%)`,
            borderColor: activeCategory === category.id ? category.color : 'transparent',
            ringColor: category.color,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onClick={() => onCategorySelect(category.id)}
        >
          {/* Glow effect on active */}
          {activeCategory === category.id && (
            <div 
              className="absolute inset-0 animate-pulse-glow" 
              style={{ 
                background: `radial-gradient(circle at center, ${category.color}30 0%, transparent 70%)`,
                opacity: 0.5
              }}
            />
          )}
          
          <div className="relative z-10 p-4 flex flex-col items-center text-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: `${category.color}20` }}
            >
              <div style={{ color: category.color }}>{category.icon}</div>
            </div>
            
            <h3 
              className="text-base font-medium mb-1"
              style={{ color: activeCategory === category.id ? category.color : 'white' }}
            >
              {category.name}
            </h3>
            
            <p className="text-xs text-gray-400 hidden md:block">{category.description}</p>
          </div>
        </Motion.div>
      ))}
    </div>
  );
};

export default CategorySelector;