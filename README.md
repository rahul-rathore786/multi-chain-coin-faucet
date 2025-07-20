# Multi-Chain ERC-20 Token Faucet

A simple frontend-only React.js application that allows users to claim ERC-20 tokens on multiple blockchain networks.

## Features

- Request tokens by entering your wallet address (no wallet connection required)
- Select from multiple blockchain networks
- One-time claim per address per chain (tracked via local storage)
- Add tokens to MetaMask with a single click after claiming
- Simple and clean user interface

## Supported Networks

- Sepolia (Ethereum Testnet) - Mock USDT
- Mumbai (Polygon Testnet)
- BSC Testnet
- Arbitrum Goerli

## Technology Stack

- React.js for the user interface
- Ethers.js for blockchain interactions
- Custom CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask extension installed in your browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fauset-project
```

2. Install dependencies:
```bash
npm install
```

3. Update the chain configuration in `src/utils/chains.js` with your own deployed contract addresses.

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deploying Mock Tokens

To deploy mock ERC-20 tokens, refer to the contracts in the `/contracts` directory. These can be deployed to any EVM-compatible blockchain using tools like Hardhat or Remix.

## Project Structure

```
fauset-project/
├── public/                 # Static files
├── src/                    # Source code
│   ├── assets/             # Images and other assets
│   ├── components/         # React components
│   │   └── FaucetForm.js   # Main form component
│   ├── utils/              # Utility functions
│   │   ├── chains.js       # Chain configuration
│   │   └── claimStorage.js # Local storage for tracking claims
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
├── contracts/              # Smart contracts for mock tokens and faucet
└── package.json            # Dependencies and scripts
```

## Note

This is a frontend-only implementation. In a production environment:

1. The private key should never be stored in frontend code
2. A backend service should be used to handle token distribution
3. A database should be used instead of localStorage for tracking claims
