import React, { useState, useEffect } from "react";
import "./App.css";
import FaucetForm from "./components/FaucetForm";
import { SUPPORTED_CHAINS } from "./utils/chains";

function App() {
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
        <FaucetForm />
      </main>
      <footer className="App-footer">
        <p>
          Supported Networks:{" "}
          {Object.values(SUPPORTED_CHAINS)
            .map((chain) => chain.name)
            .join(", ")}
        </p>
        <p>&copy; {new Date().getFullYear()} Multi-Chain ERC-20 Faucet</p>
      </footer>
    </div>
  );
}

export default App;
