import React, { useState } from 'react';
import './App.css';
import FaucetForm from './components/FaucetForm';
import { SUPPORTED_CHAINS } from './utils/chains';

function App() {
  const [result, setResult] = useState({ status: '', message: '', txHash: '', tokenInfo: null });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi-Chain ERC-20 Faucet</h1>
        <p>Get test tokens for your development needs</p>
      </header>
      <main className="App-main">
        <FaucetForm setResult={setResult} />
        
        {result.status && (
          <div className={`result ${result.status}`}>
            <h3>{result.status === 'success' ? 'Success!' : 'Error'}</h3>
            <p>{result.message}</p>
            {result.txHash && (
              <p>
                Transaction Hash:{' '}
                <a 
                  href={`${result.tokenInfo?.explorer}/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.txHash.substring(0, 10)}...
                </a>
              </p>
            )}
            
            {result.status === 'success' && result.tokenInfo && (
              <button 
                className="btn btn-secondary" 
                onClick={async () => {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_watchAsset',
                      params: {
                        type: 'ERC20',
                        options: {
                          address: result.tokenInfo.tokenAddress,
                          symbol: result.tokenInfo.tokenSymbol,
                          decimals: result.tokenInfo.tokenDecimals,
                          image: result.tokenInfo.tokenImage || '',
                        },
                      },
                    });
                  } catch (error) {
                    console.error('Error adding token to MetaMask', error);
                    setResult({
                      ...result,
                      message: `${result.message}\nError adding token to MetaMask: ${error.message}`,
                    });
                  }
                }}
              >
                Add Token to MetaMask
              </button>
            )}
          </div>
        )}
      </main>
      <footer className="App-footer">
        <p>Supported Networks: {Object.values(SUPPORTED_CHAINS).map(chain => chain.name).join(', ')}</p>
        <p>&copy; {new Date().getFullYear()} Multi-Chain ERC-20 Faucet</p>
      </footer>
    </div>
  );
}

export default App;
