# wallex-live-ethers

MetaMask-only Next.js project for WALXUSD (Wallex USD) dashboard.

## Quick start

1. Ensure Node 18+ and npm installed.
2. Copy `.env.example` to `.env.local` and update if needed.
3. Install dependencies:

```bash
npm install
```

4. Run dev server:

```bash
npm run dev
```

5. Open http://localhost:3000

Notes:
- This project uses ethers v6 and MetaMask only.
- WALXUSD contract address and USDT are set via `.env.local` or defaults in `lib/contract.js`.
