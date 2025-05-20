# Contributing to Chronos Vault

## Development Guidelines

This document outlines important guidelines for contributing to the Chronos Vault project to ensure we maintain the integrity of this fully developed application.

### Core Principles

1. **Preserve Existing Architecture**
   - Always build on top of the existing application structure
   - Never replace established routing systems or component hierarchies
   - Maintain backward compatibility with all existing features

2. **Make Targeted Changes**
   - Focus on small, incremental improvements to specific components
   - Test each change before moving to the next
   - Document your changes thoroughly

3. **Follow Established Patterns**
   - Use the same coding style and patterns as the rest of the codebase
   - Maintain consistent naming conventions
   - Follow the existing project organization

### Development Workflow

#### Before Making Changes

1. **Understand the Codebase**
   - Thoroughly explore existing components before creating new ones
   - Use the search functionality to find relevant components
   - Review the routing structure in App.tsx

2. **Plan Your Changes**
   - Document which specific files and lines you intend to modify
   - Create a development roadmap for larger features
   - Discuss architectural changes before implementation

#### During Development

1. **Use Existing Components**
   - Modify existing components rather than creating new ones
   - Extend current functionality rather than replacing it
   - Leverage the established component library (UI components, context providers)

2. **Handle Routing Carefully**
   - Maintain the existing routing structure in App.tsx
   - Add new routes following the same patterns as existing ones
   - Test navigation flows thoroughly

3. **Preserve Context Providers**
   - Ensure all required context providers are present
   - Maintain proper nesting of providers
   - Handle authentication and blockchain contexts with care

#### Testing

1. **Test Incrementally**
   - Verify each change before moving to the next
   - Test on multiple screen sizes and devices
   - Ensure cross-browser compatibility

2. **Security Testing**
   - Maintain all security measures
   - Test authentication flows
   - Verify blockchain interactions

### Critical Components

The following components are central to the application and should be modified with extreme care:

1. **Routing System**
   - App.tsx contains all route definitions
   - DocumentationRouter.tsx handles documentation page routing
   - Always maintain compatibility with existing routes

2. **Layout Components**
   - MainHeader.tsx and footer.tsx define the application shell
   - DocumentationLayout.tsx provides structure for documentation pages
   - Any changes should preserve visual consistency

3. **Context Providers**
   - auth-context.tsx manages authentication
   - multi-chain-context.tsx handles blockchain interactions
   - cvt-token-context.tsx manages token functionality

4. **Documentation Pages**
   - All files in client/src/pages/documentation/ are fully developed
   - Modify these pages carefully to maintain educational content
   - Ensure proper linking between documentation pages

### Vault Types

The project includes 22 different vault types, each with dedicated components. When modifying vault-related code:

1. Always use the existing vault type components
2. Maintain the educational aspects of each vault type
3. Ensure proper navigation between vault types

By following these guidelines, we maintain the stability and integrity of the Chronos Vault application while allowing for ongoing improvements and new features.