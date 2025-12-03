# ChainFiliates Integration Guide

## Quick Start (5 minutes)

### Step 1: Add the Script

Add this to your website's `<head>` tag:

```html
<script 
  src="https://cdn.chainfiliates.com/v1/chainfiliates.js"
  data-chainfiliates-splitter="YOUR_SPLITTER_ADDRESS"
  data-chainfiliates-chain-id="8453">
</script>
```

Replace `YOUR_SPLITTER_ADDRESS` with the address you received when you registered.

That's it. Affiliate tracking is now active.

---

### Step 2: Process Payments

At checkout, use ChainFiliates to process the payment:

**Pay with ETH:**
```javascript
// Amount in wei (e.g., 0.1 ETH = "100000000000000000")
const amount = "100000000000000000";

try {
  const receipt = await ChainFiliates.payWithETH(amount);
  console.log('Payment successful:', receipt.hash);
  // Redirect to success page
} catch (error) {
  console.error('Payment failed:', error);
}
```

**Pay with ERC20 Token (e.g., USDC):**
```javascript
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC on Base
const amount = "100000000"; // $100 USDC (6 decimals)

try {
  const receipt = await ChainFiliates.payWithToken(USDC, amount);
  console.log('Payment successful:', receipt.hash);
} catch (error) {
  console.error('Payment failed:', error);
}
```

---

## How It Works

### Affiliate Links

Your affiliates share links like:
```
https://yoursite.com?ref=0x1234567890abcdef1234567890abcdef12345678
```

When a visitor clicks this link:
1. The affiliate address is captured from the URL
2. It's stored in a cookie for 30 days
3. Any purchase during that time credits the affiliate

### Payment Flow

When a customer pays:
```
Customer pays $100
    ↓
ChainFiliates contract splits instantly:
    → $5 (5%) to ChainFiliates
    → $10 (10%) to Affiliate (your commission rate)
    → $85 to Your Wallet
```

No delays. No claims. Instant settlement.

---

## API Reference

### Initialize (Manual)

```javascript
ChainFiliates.init({
  splitter: '0x...', // Your splitter contract address
  chainId: 8453     // Base mainnet
});
```

### Check for Affiliate

```javascript
if (ChainFiliates.hasAffiliate()) {
  console.log('Referred by:', ChainFiliates.getAffiliate());
}
```

### Preview Split

```javascript
const split = await ChainFiliates.previewSplit("1000000000000000000"); // 1 ETH
console.log(split);
// {
//   platformFee: "50000000000000000",    // 0.05 ETH
//   commission: "100000000000000000",    // 0.10 ETH  
//   businessAmount: "850000000000000000" // 0.85 ETH
// }
```

---

## Platform Integration Examples

### WordPress / WooCommerce

Add to your theme's `header.php`:
```php
<script 
  src="https://cdn.chainfiliates.com/v1/chainfiliates.js"
  data-chainfiliates-splitter="<?php echo CHAINFILIATES_SPLITTER; ?>"
  data-chainfiliates-chain-id="8453">
</script>
```

Then in your checkout, call the payment function instead of your normal crypto payment.

### Shopify

Add to `theme.liquid` in the `<head>`:
```liquid
<script 
  src="https://cdn.chainfiliates.com/v1/chainfiliates.js"
  data-chainfiliates-splitter="{{ settings.chainfiliates_splitter }}"
  data-chainfiliates-chain-id="8453">
</script>
```

### React

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load ChainFiliates script
    const script = document.createElement('script');
    script.src = 'https://cdn.chainfiliates.com/v1/chainfiliates.js';
    script.async = true;
    script.onload = () => {
      window.ChainFiliates.init({
        splitter: process.env.REACT_APP_SPLITTER,
        chainId: 8453
      });
    };
    document.head.appendChild(script);
  }, []);

  const handlePayment = async (amount) => {
    const receipt = await window.ChainFiliates.payWithETH(amount);
    // Handle success
  };

  return <button onClick={() => handlePayment("100000000000000000")}>Pay 0.1 ETH</button>;
}
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.chainfiliates.com/v1/chainfiliates.js';
  script.onload = () => {
    window.ChainFiliates.init({
      splitter: import.meta.env.VITE_SPLITTER,
      chainId: 8453
    });
  };
  document.head.appendChild(script);
});

const pay = async () => {
  await window.ChainFiliates.payWithETH("100000000000000000");
};
</script>
```

### Plain HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script 
    src="https://cdn.chainfiliates.com/v1/chainfiliates.js"
    data-chainfiliates-splitter="0x..."
    data-chainfiliates-chain-id="8453">
  </script>
</head>
<body>
  <button onclick="pay()">Pay 0.1 ETH</button>
  
  <script>
    async function pay() {
      try {
        await ChainFiliates.payWithETH("100000000000000000");
        alert('Payment successful!');
      } catch (e) {
        alert('Payment failed: ' + e.message);
      }
    }
  </script>
</body>
</html>
```

---

## Supported Tokens

Any ERC20 token on Base works. Common examples:

| Token | Address | Decimals |
|-------|---------|----------|
| USDC | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 | 6 |
| USDT | 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2 | 6 |
| DAI | 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb | 18 |
| WETH | 0x4200000000000000000000000000000000000006 | 18 |

Or use your own project's token!

---

## FAQ

**Q: What if a customer pays directly to my wallet?**
A: Our listener monitors your wallet. Payments bypassing the splitter may result in account suspension per Terms of Service.

**Q: Can I change my commission rate?**
A: Yes, from your dashboard. You can also set custom rates per affiliate.

**Q: What if I need a refund?**
A: Handle refunds directly with your customer. ChainFiliates fees are non-refundable.

**Q: Which wallets are supported?**
A: MetaMask, Coinbase Wallet, WalletConnect, and any injected Web3 wallet.

---

## Support

- Dashboard: https://app.chainfiliates.com
- Docs: https://docs.chainfiliates.com
- Email: support@chainfiliates.com
