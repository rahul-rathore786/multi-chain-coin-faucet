// Utility functions to track claimed addresses using local storage

// Key for storing claims in local storage
const CLAIMS_STORAGE_KEY = 'faucet_claims';

/**
 * Check if an address has already claimed tokens for a specific chain
 * @param {string} address - The wallet address
 * @param {string} chainKey - The chain identifier
 * @returns {boolean} - True if already claimed, false otherwise
 */
export const hasAddressClaimed = (address, chainKey) => {
  if (!address || !chainKey) return false;
  
  try {
    const claims = getAllClaims();
    const key = `${address.toLowerCase()}_${chainKey}`;
    return !!claims[key];
  } catch (error) {
    console.error("Error checking claim status:", error);
    return false;
  }
};

/**
 * Mark an address as having claimed tokens for a specific chain
 * @param {string} address - The wallet address
 * @param {string} chainKey - The chain identifier
 * @param {string} txHash - Transaction hash of the claim
 */
export const recordClaim = (address, chainKey, txHash) => {
  if (!address || !chainKey) return;
  
  try {
    const claims = getAllClaims();
    const key = `${address.toLowerCase()}_${chainKey}`;
    
    claims[key] = {
      address: address.toLowerCase(),
      chain: chainKey,
      timestamp: Date.now(),
      txHash: txHash || ''
    };
    
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
  } catch (error) {
    console.error("Error recording claim:", error);
  }
};

/**
 * Get all claims from local storage
 * @returns {Object} - Object with all claims
 */
export const getAllClaims = () => {
  try {
    const claimsStr = localStorage.getItem(CLAIMS_STORAGE_KEY);
    return claimsStr ? JSON.parse(claimsStr) : {};
  } catch (error) {
    console.error("Error getting claims:", error);
    return {};
  }
};

/**
 * Clear all claims (for testing purposes)
 */
export const clearAllClaims = () => {
  try {
    localStorage.removeItem(CLAIMS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing claims:", error);
  }
};
