import React from 'react';

type Stat = {
  label: string;
  value: string;
};

type SmartContractInfoCardProps = {
  title: string;
  chain: string;
  address: string;
  deployDate: string;
  stats: Stat[];
};

const SmartContractInfoCard: React.FC<SmartContractInfoCardProps> = ({
  title,
  chain,
  address,
  deployDate,
  stats
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-400">{chain}</span>
          </div>
        </div>
        <div className="mt-2 md:mt-0 flex items-center text-sm">
          <span className="text-gray-500 mr-2">Deployed:</span>
          <span className="text-white font-medium">{deployDate}</span>
        </div>
      </div>
      
      <div className="bg-[#151515] rounded-lg p-4 border border-[#333] mb-4">
        <div className="flex items-center">
          <div className="w-[24px] text-center mr-2 text-gray-500">
            <i className="ri-link-m"></i>
          </div>
          <div className="font-mono text-sm bg-[#111] text-gray-300 rounded px-3 py-2 flex-1 overflow-x-auto">
            {address}
          </div>
          <button 
            className="ml-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => navigator.clipboard.writeText(address)}
          >
            <i className="ri-clipboard-line"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#151515] rounded-lg p-3 border border-[#333]">
            <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartContractInfoCard;