# btc-dca-tracker

A modern web-based portfolio tracker for long-term Bitcoin accumulation, supporting spot DCA and altcoin/BTC base strategy.  
Built with pure HTML/CSS/JavaScript. Supports Google Sheets personal data storage, Ethereum/Cardano wallet login, and CSV import—no backend required.

## Features

- **Spot DCA Accounting**  
  Quickly log, view, and analyze your spot crypto purchases (BTC, ADA, and more).  
- **BTC-Based Portfolio View**  
  Uniquely display all assets and performance in BTC terms—a must for serious crypto accumulators.  
- **Multiple Input Methods**  
  Manual entry, CSV upload (format provided), Google Sheets sync, and wallet-linked records.
- **Google Sheets Integration**  
  Each user’s data stored securely in their own Google Sheet—privacy first, cross-device ready.
- **Web3 Wallet Binding**  
  Bind Ethereum or Cardano wallets for decentralized login and future automation.
- **No Derivatives Support**  
  Only spot transactions supported; contracts and leverage excluded for simplicity and risk control.
- **Responsive & Open Source**  
  Runs on desktop and mobile. Easy deploy via GitHub Pages or Zeabur.

## Getting Started

1. **Clone this repo**

```bash
git clone https://github.com/YOUR_USERNAME/btc-dca-tracker.git
```

2. **Host on GitHub Pages or Zeabur**
- Push your changes.
- Enable Pages from repo settings or connect via Zeabur.
3. **Login & Setup**
- Login with Google (OAuth, Sheets access required on first use).
- Optionally bind your Ethereum/Cardano wallet.
- Start entering or importing your spot trades.

## CSV Format

CSV template for importing history:

```csv
date,exchange,pair,side,base_amount,quote_amount,price,fee,notes
2025-01-10,Binance,ADA/BTC,BUY,100,0.005,0.00005,ADA,First DCA
...
```


## Contributing

Feel free to fork, open issues, or submit pull requests for new features, bug fixes, and improvements.  
We follow Airbnb JS Style Guide—please lint your code and maintain clear commit history.

## License

MIT

---

## Support This Project

If you find this tool helpful or want to support my work, consider contributing:

- **Crypto donate（Web3）：**  
  [https://gcake119.fkey.id/](https://gcake119.fkey.id/)
- **Credit card/Line Pay：**  
  [https://open.firstory.me/join/wwhowbuhow/tier/01925f48-ec8c-449e-74f2-b5ee9380e637](https://open.firstory.me/join/wwhowbuhow/tier/01925f48-ec8c-449e-74f2-b5ee9380e637)

**Cold Wallet / Hardware Wallet Affiliate Links**  
Ledger: [https://shop.ledger.com/pages/referral-program?referral_code=NNS6VK4T6YRFP](https://shop.ledger.com/pages/referral-program?referral_code=NNS6VK4T6YRFP)  
Trezor: [https://affil.trezor.io/SHh5](https://affil.trezor.io/SHh5)  
CoolWallet: [https://www.coolwallet.io/product/coolwallet-pro/?ref=zta0ymf](https://www.coolwallet.io/product/coolwallet-pro/?ref=zta0ymf)

**Thank you for supporting independent Web3 research!**
