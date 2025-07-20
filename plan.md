Here’s your **refined full prompt** with the latest requirements:

---

### Final Prompt: Simple Multi-Chain Faucet Website (No Wallet Connect)

> **Build a frontend-only ERC-20 token faucet website** using **React.js + Ethers.js** with the following simplified features and constraints:
>
> ### 🎯 Functional Requirements:
>
> - The user manually enters their **public wallet address** (no wallet connect).
> - User selects the **chain** (e.g., Polygon, BSC, Arbitrum, etc.) from a dropdown.
> - There is **only one token per chain**, preconfigured in the frontend.
> - When the user clicks **"Send 1000 Tokens"**, the website:
>
>   - Calls the backendless smart contract (deployed per chain) to send **1000 tokens** to the entered wallet address.
>   - Uses the contract's `sendTo(address user)` function (or similar).
>
> - After successful transaction, show the **"Add Token to MetaMask"** button with correct:
>
>   - Token contract address
>   - Token symbol
>   - Decimals
>   - Chain info
>
> ### 🧾 Smart Contract Assumptions:
>
> - One faucet smart contract is deployed per chain.
> - The token is fixed per contract and passed at deployment.
> - The admin has pre-approved the contract to transfer tokens from their wallet.
> - Contract function:
>
>   ```solidity
>   function sendTo(address user) external { ... }
>   ```
>
> - Each user can claim **only once** (per chain).
>
> ### 🧱 Frontend Stack:
>
> - **React.js** (functional components)
> - **Ethers.js** (for sending the transaction via the admin wallet)
> - **custum CSS** for better and simple styling
>
> ### 🖥️ UI Design:
>
> - Input field: `Enter your wallet address`
> - Dropdown: `Select Blockchain` (Polygon, BSC, etc.)
> - Button: `Send 1000 Tokens`
> - On success: Show a `Click to Add Token to MetaMask` button
> - Show success/error messages
>
> ### 💡 Add Token to MetaMask:
>
> - Use MetaMask's `wallet_watchAsset` API:
>
>   ```js
>   await window.ethereum.request({
>     method: "wallet_watchAsset",
>     params: {
>       type: "ERC20",
>       options: {
>         address: "0xYourTokenAddress",
>         symbol: "MOCK",
>         decimals: 18,
>         image: "https://example.com/logo.png",
>       },
>     },
>   });
>   ```
>
> ### 🛠️ Frontend Config Example:

```js
const SUPPORTED_CHAINS = {
  polygon: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    faucetAddress: "0xFaucetPolygon...",
    tokenAddress: "0xTokenPolygon...",
    tokenSymbol: "POLYTKN",
    tokenDecimals: 18,
  },
  bsc: {
    name: "BSC",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org/",
    faucetAddress: "0xFaucetBSC...",
    tokenAddress: "0xTokenBSC...",
    tokenSymbol: "BSCTKN",
    tokenDecimals: 18,
  },
};
```

---
