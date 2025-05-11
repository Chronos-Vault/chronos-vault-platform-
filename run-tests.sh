#!/bin/bash

# Run Security Integration Tests
# This script runs the comprehensive security integration test suite

# Set colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Chronos Vault Security Integration Test Runner${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js to run the tests.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm to run the tests.${NC}"
    exit 1
fi

echo -e "\n${BLUE}Installing dependencies...${NC}"
npm install chalk ts-node mocha @types/mocha

echo -e "\n${BLUE}Running security integration tests...${NC}"
echo -e "${YELLOW}This may take a few minutes. Please be patient.${NC}"

# Run the main test script
npx ts-node scripts/run-security-integration-tests.ts

# Capture the exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}All security integration tests passed successfully!${NC}"
    echo -e "${GREEN}The Triple-Security architecture is fully integrated and operational.${NC}"
else
    echo -e "\n${RED}Some security integration tests failed.${NC}"
    echo -e "${YELLOW}Please review the test output and address any issues.${NC}"
fi

echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}Test execution completed${NC}"
echo -e "${BLUE}================================================${NC}"

exit $EXIT_CODE