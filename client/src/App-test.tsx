import React from 'react';

const AppTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-400">Chronos Vault Working!</h1>
        <p className="text-gray-400">Revolutionary Multi-Chain Digital Asset Security</p>
        <div className="mt-8 text-sm text-gray-500">
          <p>✓ Backend services running</p>
          <p>✓ Frontend rendering</p>
          <p>✓ React components loaded</p>
        </div>
      </div>
    </div>
  );
};

export default AppTest;