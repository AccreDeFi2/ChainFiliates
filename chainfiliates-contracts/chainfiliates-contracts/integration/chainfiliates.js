/**
 * ChainFiliates Integration Snippet
 * 
 * Add this to any website to enable affiliate tracking and payments.
 * Works with: WordPress, Shopify, React, Vue, plain HTML, anything.
 * 
 * Usage:
 * 1. Add script to your site
 * 2. Initialize with your splitter address
 * 3. Call chainfiliates.pay() at checkout
 */

(function() {
  'use strict';

  const CHAINFILIATES_API = 'https://api.chainfiliates.com'; // Your API endpoint
  const COOKIE_NAME = 'cf_ref';
  const COOKIE_DAYS = 30;

  // ABI for AffiliateSplitter (minimal)
  const SPLITTER_ABI = [
    "function payWithETH(address affiliate) external payable",
    "function payWithToken(address token, uint256 amount, address affiliate) external",
    "function payDirectETH() external payable",
    "function payDirectToken(address token, uint256 amount) external",
    "function previewSplit(uint256 amount, address affiliate) view returns (uint256 platformFee, uint256 commission, uint256 businessAmount)"
  ];

  // ERC20 ABI (minimal)
  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

  class ChainFiliates {
    constructor() {
      this.splitterAddress = null;
      this.chainId = null;
      this.affiliate = null;
      this.initialized = false;
    }

    /**
     * Initialize ChainFiliates
     * @param {Object} config
     * @param {string} config.splitter - Your AffiliateSplitter contract address
     * @param {number} config.chainId - Chain ID (8453 for Base)
     */
    init(config) {
      if (!config.splitter) {
        console.error('ChainFiliates: splitter address required');
        return;
      }

      this.splitterAddress = config.splitter;
      this.chainId = config.chainId || 8453; // Default to Base
      this.initialized = true;

      // Check for affiliate in URL
      this._captureAffiliate();
      
      // Load stored affiliate from cookie
      this._loadStoredAffiliate();

      console.log('ChainFiliates initialized', {
        splitter: this.splitterAddress,
        chainId: this.chainId,
        affiliate: this.affiliate
      });
    }

    /**
     * Capture affiliate from URL parameter
     * URL format: yoursite.com?ref=0x1234...
     */
    _captureAffiliate() {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      
      if (ref && this._isValidAddress(ref)) {
        this.affiliate = ref;
        this._setCookie(COOKIE_NAME, ref, COOKIE_DAYS);
        
        // Track click (optional - send to your API)
        this._trackClick(ref);
      }
    }

    _loadStoredAffiliate() {
      if (!this.affiliate) {
        const stored = this._getCookie(COOKIE_NAME);
        if (stored && this._isValidAddress(stored)) {
          this.affiliate = stored;
        }
      }
    }

    _isValidAddress(addr) {
      return /^0x[a-fA-F0-9]{40}$/.test(addr);
    }

    _setCookie(name, value, days) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }

    _getCookie(name) {
      return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? parts[1] : r;
      }, '');
    }

    async _trackClick(affiliate) {
      try {
        await fetch(`${CHAINFILIATES_API}/track/click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliate,
            splitter: this.splitterAddress,
            referrer: document.referrer,
            url: window.location.href,
            timestamp: Date.now()
          })
        });
      } catch (e) {
        // Silent fail - don't block user experience
      }
    }

    /**
     * Get current affiliate (if any)
     */
    getAffiliate() {
      return this.affiliate;
    }

    /**
     * Check if visitor was referred by an affiliate
     */
    hasAffiliate() {
      return !!this.affiliate;
    }

    /**
     * Preview payment split
     * @param {string} amount - Amount in wei
     * @returns {Object} { platformFee, commission, businessAmount }
     */
    async previewSplit(amount) {
      if (!this.initialized) throw new Error('ChainFiliates not initialized');
      if (!window.ethereum) throw new Error('No wallet detected');

      const { ethers } = await this._loadEthers();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const splitter = new ethers.Contract(this.splitterAddress, SPLITTER_ABI, provider);

      const affiliate = this.affiliate || ethers.ZeroAddress;
      const [platformFee, commission, businessAmount] = await splitter.previewSplit(amount, affiliate);

      return {
        platformFee: platformFee.toString(),
        commission: commission.toString(),
        businessAmount: businessAmount.toString()
      };
    }

    /**
     * Process payment with ETH
     * @param {string} amount - Amount in wei
     * @returns {Object} Transaction receipt
     */
    async payWithETH(amount) {
      if (!this.initialized) throw new Error('ChainFiliates not initialized');
      if (!window.ethereum) throw new Error('No wallet detected');

      const { ethers } = await this._loadEthers();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const splitter = new ethers.Contract(this.splitterAddress, SPLITTER_ABI, signer);

      // Ensure correct network
      await this._ensureNetwork(provider);

      let tx;
      if (this.affiliate) {
        tx = await splitter.payWithETH(this.affiliate, { value: amount });
      } else {
        tx = await splitter.payDirectETH({ value: amount });
      }

      const receipt = await tx.wait();
      
      // Track conversion
      await this._trackConversion(receipt.hash, amount, 'ETH');

      return receipt;
    }

    /**
     * Process payment with ERC20 token
     * @param {string} tokenAddress - ERC20 token contract address
     * @param {string} amount - Amount in token's smallest unit
     * @returns {Object} Transaction receipt
     */
    async payWithToken(tokenAddress, amount) {
      if (!this.initialized) throw new Error('ChainFiliates not initialized');
      if (!window.ethereum) throw new Error('No wallet detected');

      const { ethers } = await this._loadEthers();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Ensure correct network
      await this._ensureNetwork(provider);

      // Check and set approval
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const allowance = await token.allowance(userAddress, this.splitterAddress);
      
      if (allowance < BigInt(amount)) {
        const approveTx = await token.approve(this.splitterAddress, amount);
        await approveTx.wait();
      }

      // Execute payment
      const splitter = new ethers.Contract(this.splitterAddress, SPLITTER_ABI, signer);
      
      let tx;
      if (this.affiliate) {
        tx = await splitter.payWithToken(tokenAddress, amount, this.affiliate);
      } else {
        tx = await splitter.payDirectToken(tokenAddress, amount);
      }

      const receipt = await tx.wait();
      
      // Track conversion
      await this._trackConversion(receipt.hash, amount, tokenAddress);

      return receipt;
    }

    async _ensureNetwork(provider) {
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== this.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + this.chainId.toString(16) }],
          });
        } catch (switchError) {
          // Chain not added, try to add it
          if (switchError.code === 4902) {
            await this._addChain();
          } else {
            throw switchError;
          }
        }
      }
    }

    async _addChain() {
      // Base mainnet
      if (this.chainId === 8453) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
          }]
        });
      }
    }

    async _trackConversion(txHash, amount, token) {
      try {
        await fetch(`${CHAINFILIATES_API}/track/conversion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliate: this.affiliate,
            splitter: this.splitterAddress,
            txHash,
            amount,
            token,
            chainId: this.chainId,
            timestamp: Date.now()
          })
        });
      } catch (e) {
        // Silent fail
      }
    }

    async _loadEthers() {
      // Use existing ethers if available, otherwise load from CDN
      if (window.ethers) return { ethers: window.ethers };
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.9.0/ethers.umd.min.js';
        script.onload = () => resolve({ ethers: window.ethers });
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  }

  // Expose globally
  window.ChainFiliates = new ChainFiliates();

  // Auto-init if data attributes present
  document.addEventListener('DOMContentLoaded', () => {
    const script = document.querySelector('script[data-chainfiliates-splitter]');
    if (script) {
      window.ChainFiliates.init({
        splitter: script.dataset.chainfiliatesSplitter,
        chainId: parseInt(script.dataset.chainfiliatesChainId) || 8453
      });
    }
  });

})();
