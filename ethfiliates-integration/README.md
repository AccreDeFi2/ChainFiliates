# EthFiliates - No-Code Affiliate Program for Ethereum & EVM Chains

A complete, production-ready affiliate program platform that allows users to create and manage affiliate campaigns across multiple EVM blockchains without writing any code.

## 🌟 Features

### Multi-Blockchain Support (7 Networks)
- **Ethereum Mainnet** (ERC20)
- **Binance Smart Chain** (BEP20)
- **Avalanche C-Chain** (ERC20)
- **Base** (ERC20)
- **Linea** (ERC20)
- **XDC Network** (XRC20)
- **PulseChain** (PRC20)

### Core Capabilities
- ✅ **No-Code Campaign Creation** - Intuitive wizard-based interface
- ✅ **Any ERC20/BEP20/PRC20/XRC20 Token** - Pay affiliates in any token
- ✅ **MetaMask Integration** - Direct wallet connection for payments
- ✅ **Real-Time Tracking** - Monitor referrals, conversions, and payouts
- ✅ **Partner Management** - Add, manage, and track affiliate performance
- ✅ **Billing Dashboard** - $150/month subscription + 5% commission tracking
- ✅ **Referral Link Generation** - Unique links for each partner
- ✅ **Multi-Chain Payments** - USDT payments across all supported blockchains

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MySQL database (local or cloud)
- MetaMask browser extension (for testing)

### Installation

```bash
# Extract the source code
unzip ethfiliates-source.zip
cd usher_integration_platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and API keys

# Create database and run migrations
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Demo (No Installation Required)

Open `ethfiliates-demo.html` in any web browser to see an interactive demo of the UI. This is a self-contained HTML file that requires no dependencies.

```bash
# Simply open in your browser
open ethfiliates-demo.html
# or
firefox ethfiliates-demo.html
```

## 📁 Project Structure

```
ethfiliates/
├── client/                          # React 19 Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Campaigns.tsx       # Campaign listing
│   │   │   ├── CreateCampaign.tsx  # Campaign wizard
│   │   │   └── Billing.tsx         # Billing dashboard
│   │   ├── components/
│   │   │   ├── WalletConnectButton.tsx  # MetaMask connect
│   │   │   ├── PaymentModal.tsx         # Payment UI
│   │   │   └── TokenSelector.tsx        # Token selection
│   │   ├── contexts/
│   │   │   └── WalletContext.tsx        # Wallet state management
│   │   ├── App.tsx                 # Routes and layout
│   │   └── main.tsx                # Entry point
│   └── index.html                  # HTML template
│
├── server/                          # Express Backend
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database helpers
│   ├── blockchain.test.ts          # Blockchain tests
│   ├── token-standards.test.ts     # Token standard tests
│   └── wallet.test.ts              # Wallet integration tests
│
├── shared/                          # Shared Utilities
│   ├── blockchains.ts              # Blockchain configs
│   ├── tokenStandards.ts           # Token standard definitions
│   └── tokenUtils.ts               # Token utilities
│
├── drizzle/                         # Database
│   └── schema.ts                   # Database schema
│
├── ethfiliates-demo.html           # Standalone demo
└── package.json                    # Dependencies
```

## 🗄️ Database Schema

### Tables
- **users** - User authentication and profiles
- **campaigns** - Affiliate campaign configurations
- **partnerships** - Affiliate partner relationships
- **referralLinks** - Unique referral tokens
- **referralEvents** - Referral tracking events
- **subscriptions** - User subscription status
- **billingTransactions** - Payment history

## 🔌 API Endpoints (tRPC)

### Campaign Management
- `campaigns.create` - Create new campaign
- `campaigns.list` - Get user's campaigns
- `campaigns.getById` - Get campaign details
- `campaigns.update` - Update campaign settings
- `campaigns.delete` - Delete campaign

### Partnership Management
- `partnerships.add` - Add affiliate partner
- `partnerships.list` - Get campaign partners
- `partnerships.getStats` - Get partner performance
- `partnerships.remove` - Remove partner

### Referral Tracking
- `referrals.generateLink` - Generate referral link
- `referrals.trackClick` - Track link click (public)
- `referrals.recordEvent` - Record referral event
- `referrals.getStats` - Get referral statistics

### Billing
- `billing.getSubscription` - Get subscription status
- `billing.getTransactions` - Get payment history
- `billing.initiatePayment` - Start payment process

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/blockchain.test.ts

# Run tests in watch mode
pnpm test --watch
```

### Test Coverage
- 38 token standard tests
- 21 blockchain configuration tests
- 12 wallet integration tests
- 21 billing and subscription tests
- Total: 92+ tests (all passing ✅)

## 🛠️ Development

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Code Quality
```bash
# Type checking
pnpm check

# Format code
pnpm format
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```
DATABASE_URL=mysql://user:password@localhost:3306/ethfiliates
JWT_SECRET=your-secret-key
VITE_APP_TITLE=EthFiliates
VITE_APP_LOGO=/logo.png
```

## 💳 Monetization Model

- **Subscription**: $150/month per user
- **Commission**: 5% of total affiliate payouts
- **Payment**: USDT to wallet `0x0bc01063610a23883110c95fab8951c818f4b7e2`
- **Supported Chains**: All 7 supported blockchains

## 🔗 Blockchain Integration

### Supported Token Standards

| Blockchain | Standard | Native Currency | Chain ID |
|-----------|----------|-----------------|----------|
| Ethereum | ERC20 | ETH | 1 |
| BSC | BEP20 | BNB | 56 |
| Avalanche | ERC20 | AVAX | 43114 |
| Base | ERC20 | ETH | 8453 |
| Linea | ERC20 | ETH | 59144 |
| XDC | XRC20 | XDC | 50 |
| PulseChain | PRC20 | PLS | 369 |

### MetaMask Integration

The platform uses MetaMask for:
- Wallet connection and authentication
- Token balance checking
- Transaction signing
- Network switching
- Direct USDT transfers

## 📊 Key Metrics Tracked

- Total referrals generated
- Conversion rate per partner
- Total payouts distributed
- Commission collected
- Active campaigns
- Active partners
- Revenue by blockchain

## 🚀 Deployment

The application is ready for deployment to:
- Vercel (frontend)
- AWS/GCP/Azure (backend)
- Railway/Render (full-stack)
- Docker containers

See deployment guides in `/docs` for detailed instructions.

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues, questions, or contributions, please visit:
- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@ethfiliates.com

## 🎯 Roadmap

- [ ] Smart contract deployment automation
- [ ] Affiliate portal for partners
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Multi-language support

---

**EthFiliates** - Making affiliate programs accessible to everyone on Ethereum and EVM chains.
