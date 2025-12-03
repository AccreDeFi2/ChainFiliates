# EthFiliates - TODO

## Rebranding to EthFiliates
- [x] Update all page titles and branding from "Usher" to "EthFiliates"
- [x] Update subtitle to "A No-Code Affiliate Program for Ethereum and other EVM based businesses"
- [x] Update color scheme and visual branding
- [x] Update all navigation and UI text

## Phase 1: Architecture & API Design
- [x] Document Usher core concepts and integration points
- [x] Design simplified API endpoints for campaign creation and management
- [x] Define data models for campaigns, rewards, and partner programs
- [x] Plan SDK integration strategy (JavaScript/TypeScript)

## Phase 2: Multi-Blockchain Support
- [x] Add support for Binance BSC (Chain ID 56)
- [x] Add support for Avalanche C-Chain (Chain ID 43114)
- [x] Add support for XDC Network (Chain ID 50)
- [x] Add support for Base (Chain ID 8453)
- [x] Add support for Linea (Chain ID 59144)
- [x] Add support for PulseChain (Chain ID 369)
- [x] Update campaign creation wizard with new blockchain options
- [x] Update RPC endpoints and explorer URLs for each chain

## Phase 3: Monetization Features
- [x] Add subscription billing ($150/month)
- [x] Implement 5% commission tracking on affiliate payouts
- [x] Create billing dashboard for users
- [x] Add USDT payment collection to 0x0bc01063610a23883110c95fab8951c818f4b7e2
- [x] Implement payment history and invoicing
- [x] Add subscription status tracking

## Phase 5: MetaMask Wallet Integration
- [x] Install web3 and wagmi dependencies
- [x] Create wallet connection context and hooks
- [x] Add MetaMask connect button to UI
- [x] Implement USDT token contract interaction
- [x] Create payment transaction functions
- [x] Add transaction confirmation and status tracking
- [x] Implement wallet balance checking
- [x] Add network switching for multi-chain support
- [x] Create payment confirmation modal
- [x] Add transaction history to billing page
- [x] Create comprehensive wallet integration tests (12 tests passing)

## Phase 6: Multi-Standard Token Support
- [x] Create token utility functions for address validation
- [x] Build TokenSelector component for UI
- [x] Create comprehensive token tests (29/30 passing)
- [x] Support ERC20 standard (Ethereum, Avalanche, Base, Linea)
- [x] Support BEP20 standard (Binance Smart Chain)
- [x] Support PRC20 standard (PulseChain)
- [x] Support XRC20 standard (XDC Network)
- [x] Create token standard detection by chain
- [x] Add token standard validation tests (42 tests passing)
- [ ] Update campaign schema to store token standard type
- [ ] Add token standard selector to campaign wizard
- [ ] Update payment modal for multi-standard support
- [ ] Implement token standard-specific contract interactions
- [ ] Create documentation for supported token standards per chain

## Phase 4: Database Schema
- [x] Create campaigns table (name, description, reward type, contract address, etc.)
- [x] Create rewards table (token address, decimals, type: ERC20/PST)
- [x] Create partnerships table (partner wallet, campaign, status, earnings)
- [x] Create referral links table (campaign, partner, link token, click count)
- [x] Add indexes and relationships

## Phase 3: Backend API Implementation
- [ ] Implement campaign creation endpoint (simplified form)
- [ ] Implement campaign retrieval and listing endpoints
- [ ] Implement reward configuration endpoint
- [ ] Implement partnership management endpoints
- [ ] Implement referral link generation and tracking
- [ ] Add Usher SDK integration for smart contract interaction
- [ ] Implement wallet connection and validation
- [ ] Add error handling and validation

## Phase 4: Frontend UI
- [ ] Create campaign creation wizard (multi-step form)
- [ ] Create campaign dashboard (overview, stats, management)
- [ ] Create reward configuration interface
- [ ] Create partnership management interface
- [ ] Create referral link generation and sharing UI
- [ ] Implement responsive design and accessibility

## Phase 5: Integration & Testing
- [ ] Test campaign creation flow end-to-end
- [ ] Test reward distribution logic
- [ ] Test referral tracking accuracy
- [ ] Test wallet integration
- [ ] Write unit tests for critical procedures
- [ ] Test on testnet before mainnet

## Phase 6: Documentation & Deployment
- [ ] Create API documentation
- [ ] Create user guide for non-technical users
- [ ] Create integration guide for developers
- [ ] Generate SDK snippet for easy integration
- [ ] Prepare deployment checklist
