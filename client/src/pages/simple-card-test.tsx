import React, { useState } from 'react';
import { useLocation } from 'wouter';

// This is a super minimal implementation to test centered feature items
export default function SimpleCardTest() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-purple-500 mb-6 text-center">Simple Centered Feature List Test</h1>
      
      <div className="max-w-md mx-auto bg-gray-900 rounded-lg border border-purple-500 p-6">
        <h2 className="text-xl font-bold text-center mb-3">Test Card</h2>
        
        <p className="text-gray-400 text-center mb-6">This card has a simplified feature list with proper centering</p>
        
        <h3 className="text-sm font-semibold text-gray-300 mb-4 text-center">Key Features:</h3>
        
        {/* Method 1: Flex with margin auto */}
        <div className="mb-8">
          <h4 className="text-xs text-center mb-2">Method 1: Flex with margin auto</h4>
          <div className="flex flex-col items-center mb-4">
            {["Feature One", "Feature Two", "Feature Three"].map((feature, i) => (
              <div key={i} className="flex items-center mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                <span className="text-xs text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Method 2: Text-center with display-inline-block */}
        <div className="mb-8">
          <h4 className="text-xs text-center mb-2">Method 2: Text-center with inline-block</h4>
          <div className="text-center">
            {["Feature One", "Feature Two", "Feature Three"].map((feature, i) => (
              <div key={i} className="mb-2 inline-block text-left">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block mr-2 align-middle"></span>
                <span className="text-xs text-gray-300 inline-block align-middle">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Method 3: Table layout */}
        <div>
          <h4 className="text-xs text-center mb-2">Method 3: Table layout</h4>
          <table className="w-full border-collapse">
            <tbody>
              {["Feature One", "Feature Two", "Feature Three"].map((feature, i) => (
                <tr key={i} className="text-center">
                  <td className="text-center" style={{ width: '50%' }}>
                    <div className="flex justify-end">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    </div>
                  </td>
                  <td className="text-left pl-2" style={{ width: '50%' }}>
                    <span className="text-xs text-gray-300">{feature}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/')}
          className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}