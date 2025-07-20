import React, { useState, useEffect } from 'react';
import './App.css';
import FaucetForm from './components/FaucetForm';
import { SUPPORTED_CHAINS } from './utils/chains';

function App() {

  const [result, setResult] = useState({ status: '', message: '', txHash: '', tokenInfo: null });
  const [activeNetworks, setActiveNetworks] = useState(0);

  // Count active networks
  useEffect(() => {
    setActiveNetworks(Object.keys(SUPPORTED_CHAINS).length);
  }, []);

  return (
    <div className="App">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <header className="App-header">
        <div className="logo">🪙</div>
        <h1>Multi-Chain ERC-20 Faucet</h1>
        <p>Get test tokens instantly across multiple blockchain networks</p>
        <div className="network-stats">
          <div className="stat-item">
            <span className="stat-value">{activeNetworks}</span>
            <span className="stat-label">Networks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">1000</span>
            <span className="stat-label">Tokens per claim</span>
          </div>
        </div>
      </header>

      <main className="App-main">
        <FaucetForm setResult={setResult} />
        
        {result.status && (
          <div className={`result-box ${result.status === 'success' ? 'result-success' : 'result-error'}`}>
            <div className="result-icon">
              {result.status === 'success' ? '✅' : '❌'}
            </div>
            <div className="result-content">
              <h3>{result.status === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}</h3>
              <p>{result.message}</p>
              {result.txHash && (
                <p className="tx-hash">
                  Transaction Hash:{' '}
                  <a 
                    href={`${result.tokenInfo?.explorer}/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.txHash.substring(0, 8)}...{result.txHash.substring(result.txHash.length - 8)}
                    <span className="external-link">↗</span>
                  </a>
                </p>
              )}
              {result.status === 'success' && result.tokenInfo && (
                <div>
                  <button 
                    className="btn btn-add-token" 
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
                </div>
              )}
            </div>
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
