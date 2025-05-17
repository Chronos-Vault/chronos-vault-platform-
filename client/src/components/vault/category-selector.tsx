import React from 'react';

interface VaultCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  vaultTypes: string[];
}

interface CategorySelectorProps {
  categories: VaultCategory[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`group relative p-5 border-2 rounded-xl overflow-hidden transition-all duration-500 cursor-pointer transform-gpu hover:-translate-y-1 ${
            activeCategory === category.id
              ? 'animate-float'
              : 'hover:shadow-lg'
          }`}
          style={{
            background: `linear-gradient(135deg, ${category.color}10 0%, rgba(0,0,0,0.4) 100%)`,
            borderColor: activeCategory === category.id ? category.color : `${category.color}30`,
            boxShadow: activeCategory === category.id ? `0 10px 25px ${category.color}20` : 'none'
          }}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transform translate-x-10 translate-y-10" style={{background: `${category.color}10`}}></div>
          
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full mr-3" style={{background: `${category.color}15`}}>
              {category.icon}
            </div>
            <h3 
              className="text-lg font-bold relative z-10 transition-colors duration-300"
              style={{ 
                color: category.color,
                textShadow: activeCategory === category.id ? `0 0 10px ${category.color}80` : 'none'
              }}
            >
              {category.name}
            </h3>
          </div>
          
          <div className="h-0.5 w-12 rounded-full mb-3" style={{ background: category.color }}></div>
          
          <p className="text-sm text-gray-300 mb-3 relative z-10 group-hover:text-white transition-colors">
            {category.description}
          </p>
          
          <ul className="text-xs text-gray-400 space-y-2 relative z-10">
            {category.vaultTypes.map((vault, idx) => (
              <li key={idx} className={`flex items-center transition-colors duration-300 ${activeCategory === category.id ? `text-${category.color.replace('#', '')}/90` : `group-hover:text-${category.color.replace('#', '')}/90`}`}>
                <div className="w-2 h-2 rounded-full mr-2" style={{ background: category.color }}></div>
                {vault}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;