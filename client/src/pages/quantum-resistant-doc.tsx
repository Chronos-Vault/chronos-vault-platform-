import React from 'react';
import DocumentationRouter from '@/components/documentation/DocumentationRouter';

/**
 * This is a routing helper component for the quantum-resistant-vault documentation.
 * It properly routes to the correct documentation page without duplicating routes.
 */
const QuantumResistantDocPage = () => {
  return <DocumentationRouter vaultType="quantum-resistant-vault" />;
};

export default QuantumResistantDocPage;