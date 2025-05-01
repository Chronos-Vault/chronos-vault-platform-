# Chronos Vault Setup Guide

This guide will help you set up and run the Chronos Vault platform on your local environment.

## Prerequisites

- Node.js v20 or later
- PostgreSQL database
- Blockchain API keys for TON, Ethereum, and Solana

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chronos-vault.git
cd chronos-vault
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file in the root directory:

```
DATABASE_URL=postgresql://username:password@localhost:5432/chronos_vault
PGHOST=localhost
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=chronos_vault
PGPORT=5432
TON_API_KEY=your_ton_api_key
ETHEREUM_RPC_URL=your_ethereum_rpc_url
SOLANA_RPC_URL=https://api.devnet.solana.com
```

4. Initialize the database:

```bash
npm run db:push
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

This will run the application in development mode with hot-reloading enabled.

### Production Build

Build and start the application for production:

```bash
npm run build
npm start
```

## Testing

Run the test suite:

```bash
npm test
```

## Blockchain Connection Testing

You can test blockchain connections using the security testing dashboard:

1. Start the application
2. Navigate to `/security-testing` in your browser
3. Verify that the blockchains show as operational

## Common Issues and Solutions

### Database Connection Issues

If you encounter database connection errors:

- Verify PostgreSQL is running
- Check that your DATABASE_URL and PG* environment variables are correct
- Ensure your database user has the necessary permissions

### Blockchain Connection Issues

If you see blockchain connection errors:

- Verify your API keys are valid
- Check network connectivity to the blockchain providers
- Ensure you're using the correct network endpoints (mainnet/testnet)

### User Authentication Issues

For wallet connection problems:

- Install MetaMask for Ethereum testing
- Use TON Connect extension for TON testing
- Install Phantom wallet for Solana testing

## Support

For additional support, please contact our development team at chronosvault@chronosvault.org.
