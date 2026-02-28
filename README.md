# 🚀 Fufu - Revolutionary IP Management Platform

> **The Future of Intellectual Property Management on Blockchain**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Creditcoin](https://img.shields.io/badge/Creditcoin-000000?style=flat&logo=ethereum&logoColor=white)](https://creditcoin.network/)

---

## Project Details

**Project Description**  
Fufu is a decentralized intellectual property (IP) management platform built on Creditcoin. Creators can register IP assets as token-bound accounts (ERC-6551), mint licenses with programmable terms and royalties, receive and distribute revenue on-chain, and resolve disputes through an arbitration system. The platform uses IPFS for storage, integrates AI-powered infringement detection, and offers transfer and gifting of IP assets with full on-chain provenance. Built for the creator economy, Fufu unifies registration, licensing, monetization, and protection in one dashboard with verifiable, transparent records.

**Hackathon track:** Legacy Builders

**Improvement:** Improving the frontend.

**Tech stack**
- **Frontend:** React 18, TypeScript, Vite, Thirdweb SDK, custom CSS (glassmorphism), React Context API
- **Backend:** Node.js, TypeScript, Express.js
- **Blockchain & contracts:** Solidity, Viem, Creditcoin (Testnet), Hardhat, Hardhat Ignition; ERC-6551 token-bound accounts (ERC6551Registry, ERC6551Account)
- **Storage:** IPFS, Pinata
- **Services:** Yakoa (AI-powered infringement detection)
- **Infrastructure:** Creditcoin RPC, Pinata IPFS pinning

---

## Project Demo Link

This is the URL to the live working environment of the solution the team has developed.

**[Open live demo](https://superlative-youtiao-adfd5c.netlify.app/)**

---

## Pitch Deck

**[View pitch deck (PDF)](https://drive.google.com/file/d/1WWvr84-tPiO0VlBjizR7vpGmWYa7zKAM/view?usp=sharing)**

---

## Project Demo Video

**[Watch the project demo video](https://youtu.be/0qzSrBZPHTU)**

A submission without a demo video link will not be scored.

---

## 📋 Table of Contents

- [Project Details](#project-details)
- [Project Demo Link](#project-demo-link)
- [Pitch Deck](#pitch-deck)
- [Project Demo Video](#project-demo-video)
- [📦 Implementation Summary](#-implementation-summary)
- [🎯 Vision & Mission](#-vision--mission)
- [💼 Business Model](#-business-model)
- [🏗️ Technology Stack](#️-technology-stack)
- [🚀 Key Features](#-key-features)
- [📈 Market Opportunity](#-market-opportunity)
- [👥 Team](#-team)
- [🎯 Founder-Product Fit](#-founder-product-fit)
- [🗺️ Roadmap](#️-roadmap)
- [💰 Revenue Streams](#-revenue-streams)
- [🔮 Future Vision](#-future-vision)
- [🚀 Get Started](#-get-started)

---

## 📦 Implementation Summary

This section documents the current implementation state of the Fufu platform.

### Branding & Assets
- **Application name**: Fufu (renamed from Sear throughout the codebase).
- **Logo & favicon**: Sourced from `app/public/fufu.png`; referenced as `/fufu.png` in HTML and via `LOGO_FAVICON_URL` in the frontend. Used for favicon, apple-touch-icon, Open Graph, and Twitter card images.
- **Contract key**: `ModredIPModule#ModredIP` is kept in config and JSON for compatibility; the user-facing product name is Fufu.

### Network & Blockchain
- **Network**: Creditcoin Testnet only (Chain ID: 102031).
- **RPC**: Default `https://rpc.cc3-testnet.creditcoin.network`. Backend uses this when `RPC_PROVIDER_URL` is unset or points to another network, so transactions always go to Creditcoin.
- **Native token**: CTC. All fees and royalties are in CTC.
- **Explorer**: https://creditcoin-testnet.blockscout.com/

### Smart Contracts
- **Deployment**: Hardhat Ignition; Solidity optimizer enabled with `runs: 1` for reliable deployment.
- **Deployed addresses** (Creditcoin Testnet):
  - **ModredIP (Fufu)**: `0x99edD1865D5Cef89B17eF8ca2C6538396d6c5F40`
  - **ERC6551Registry**: `0xE9053cD4c52039C79b1ED2708558eCcdd8Cc6706`
  - **ERC6551Account**: `0x9be86cb3691785f591DE11aa398863B89241B677`
- **Address config**: Canonical list in `ignition/deployments/chain-102031/deployed_addresses.json`; app uses `app/src/deployed_addresses.json` (postinstall can copy from ignition). Backend reads contract address from request body (`fufuContractAddress`).

### Backend
- **Stack**: Node.js, TypeScript, Express, Viem. Runs with `ts-node` (e.g. `yarn start`).
- **APIs**:
  - **POST `/api/register`**: Registers IP on Creditcoin (and optionally Yakoa). Body: `ipHash`, `metadata`, `isEncrypted`, `fufuContractAddress`, optional `skipContractCall`. Legacy `modredIpContractAddress` supported.
  - **POST `/api/license/mint`**: Mints a license. Body: `tokenId`, `royaltyPercentage`, `duration`, `commercialUse`, `terms`, `fufuContractAddress`. Enforces one license per IP.
  - **GET `/api/infringement/status/:contractAddress/:tokenId`**: Returns Yakoa infringement status for an IP asset.
- **Creditcoin behavior**: When simulation returns no data (common on Creditcoin RPC), backend skips simulation and calls `writeContract` directly with the same args and correct chain.
- **Config**: `.env` in backend root; required: `WALLET_PRIVATE_KEY`, `PINATA_JWT`; optional: `RPC_PROVIDER_URL` (only used if URL contains "creditcoin"), Yakoa vars for registration and infringement. Startup logs the RPC host and chain ID.
- **Transaction reliability**: Nonce handling, retries (e.g. 3 attempts) with backoff, and clear error messages.

### Frontend
- **Stack**: React 18, TypeScript, Vite, Thirdweb SDK, custom CSS.
- **Backend URL**: Configured as `http://localhost:5000`; all register, license, and infringement calls go to this backend.
- **Env**: `VITE_PINATA_JWT` for IPFS uploads (e.g. in `app/.env`). Thirdweb client ID in `src/main.tsx` (or env) for wallet connect.
- **Contract addresses**: Loaded from `app/src/deployed_addresses.json`; key `ModredIPModule#ModredIP` for the Fufu contract.
- **Infringement**: Infringement status is auto-loaded when the dashboard loads and IP assets are fetched (one request per asset with a short delay). Each card shows a "Checking…" state while loading, then "Clean" or "X Found" with severity. Manual "Check Status" button still available; toasts only on manual check.

### Yakoa Integration
- **Registration**: Backend can register IPs with Yakoa (metadata, authorizations) when handling `/api/register`.
- **Infringement**: Backend resolves `contractAddress:tokenId` to Yakoa token ID and returns infringement data (in-network, external, totals, severity). Frontend displays this on the dashboard and on the Infringement tab.

### Deployment & CI
- **Contract deploy**: From repo root, `npx hardhat ignition deploy ignition/modules/ModredIP.ts --network creditcoinTestnet`. Update `deployed_addresses.json` (or run app postinstall) after deploy. See `DEPLOYMENT_GUIDE.md`.
- **Docker/CI**: GitHub Actions build and push image as `fufu:latest`; deploy script expects backend `.env` at `/home/ubuntu/fufu/.env` and runs container named `fufu` on the server.

### Project Structure (relevant paths)
- `app/` – React frontend (Vite); `app/public/fufu.png` logo; `app/src/deployed_addresses.json` addresses.
- `backend/` – Express API; `backend/src/utils/config.ts` network/RPC; `backend/.env` secrets.
- `ignition/` – Hardhat Ignition deploy modules; `ignition/deployments/chain-102031/deployed_addresses.json` canonical addresses.
- `DEPLOYMENT_GUIDE.md` – Contract deployment and address update steps.
- `app/README.md` – Frontend features and usage.
- `backend/README.md` – Backend API and env vars.

---

## 🎯 Vision & Mission

### Vision
To democratize intellectual property management by creating a decentralized, transparent, and automated platform that empowers creators to protect, monetize, and manage their IP assets with unprecedented efficiency.

### Mission
Fufu revolutionizes IP management by combining blockchain technology with AI-powered infringement detection, creating a comprehensive ecosystem where creators can register, license, monetize, and protect their intellectual property with built-in enforcement mechanisms.

---

## 💼 Business Model

### Core Value Proposition
Fufu addresses critical pain points in the current IP management landscape:

1. **Fragmented IP Management**: Centralized platform for all IP lifecycle
2. **Inefficient Licensing**: Automated, programmable licensing terms
3. **Poor Enforcement**: AI-powered infringement detection
4. **Revenue Leakage**: Automated royalty distribution
5. **Legal Complexity**: Simplified dispute resolution

### Target Markets

#### Primary Markets
- **Content Creators**: YouTubers, musicians, artists, writers
- **Software Developers**: Open-source contributors, indie developers
- **Designers**: Graphic designers, UI/UX professionals
- **Inventors**: Patent holders, innovators

#### Secondary Markets
- **Entertainment Industry**: Film, TV, gaming companies
- **Publishing**: Authors, publishers, media companies
- **Technology**: Startups, tech companies
- **Academic**: Researchers, universities

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Web3**: Thirdweb SDK
- **Styling**: Custom CSS with glassmorphism design
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Blockchain**: Viem for Creditcoin integration
- **Storage**: IPFS (Pinata) for decentralized storage
- **AI Integration**: Yakoa for infringement detection

### Smart Contracts
- **Platform**: Solidity on Creditcoin
- **Core**: ERC-6551 token-bound accounts
- **Registry**: ERC6551Registry for account management
- **Account**: ERC6551Account for programmable logic

### Infrastructure
- **Blockchain**: Creditcoin Testnet (Chain ID: 102031)
- **RPC**: https://rpc.cc3-testnet.creditcoin.network
- **Explorer**: https://creditcoin-testnet.blockscout.com/
- **Native token**: CTC
- **Storage**: IPFS for censorship-resistant content
- **Monitoring**: Yakoa API for infringement detection
- **Deployment**: Hardhat Ignition for contract deployment
- **Contract addresses**: Stored in `app/src/deployed_addresses.json` (canonical copy in `ignition/deployments/chain-102031/deployed_addresses.json`; app postinstall copies from there).

---

## 🚀 Key Features

### ✅ IP Asset Registration
- **NFT Minting**: Convert IP into tradeable assets
- **Metadata Storage**: Decentralized IPFS storage
- **Encryption Support**: Optional content protection
- **Drag-and-Drop Interface**: User-friendly file upload

### ✅ License Management
- **Programmable Terms**: On-chain license enforcement
- **Royalty Management**: Automatic percentage distribution
- **Commercial Rights**: Granular usage permissions
- **Attribution Requirements**: Built-in creator recognition
- **One License Per IP**: Enforced validation to ensure only one license can be minted per IP asset
- **Advanced Templates**: 8 predefined license templates (Commercial, Non-Commercial, Creative Commons variants, Public Domain, Exclusive, Custom)
- **Template Customization**: Select a template and customize any parameter to fit specific needs
- **Smart Defaults**: Templates include optimized settings for common licensing scenarios

### ✅ Revenue Management
- **Direct Payments**: Revenue to IP assets
- **Automated Royalty Calculations**: Real-time preview of royalty distribution before payment
- **Royalty Breakdown**: Transparent display of platform fees, license holder shares, and IP owner share
- **Royalty Vaults**: Automated distribution systems
- **Token Claims**: Royalty token claiming with accumulated balance display
- **Transparent Tracking**: All transactions on-chain

### ✅ Infringement Detection
- **AI-Powered Monitoring**: Yakoa integration with automated scanning
- **Real-time Dashboard**: Comprehensive infringement monitoring interface
- **Automated Monitoring**: Periodic checks with configurable intervals
- **Severity Analysis**: Automatic classification (Low, Medium, High, Critical)
- **Detailed Reports**: In-network and external platform infringement tracking
- **Action Recommendations**: AI-suggested steps based on infringement severity
- **Real-time Alerts**: Instant notifications when infringements are detected
- **Metadata Analysis**: Comprehensive IP tracking with similarity scoring
- **Commercial Focus**: Business-oriented monitoring across multiple platforms

### ✅ Dispute Resolution
- **On-Chain Disputes**: Immutable dispute records
- **Arbitration System**: Decentralized arbitrator network
- **Evidence Storage**: Permanent dispute history
- **Hybrid Enforcement**: Blockchain + traditional legal
- **Arbitrator Management**: Register, stake, and unstake functionality
- **Auto-Resolution**: Majority-based automatic dispute resolution
- **Reputation System**: Rewards for correct arbitration decisions

---

## 📈 Market Opportunity

### Market Size
- **Global IP Market**: $5.5 trillion (2023)
- **Content Creation Market**: $13.8 billion (2023)
- **NFT Market**: $16 billion (2023)
- **Licensing Market**: $300 billion (2023)

### Growth Drivers
1. **Creator Economy Boom**: 50+ million content creators
2. **NFT Adoption**: Growing digital asset market
3. **AI Content Creation**: Increasing IP generation
4. **Remote Work**: Distributed IP management needs
5. **Blockchain Adoption**: Growing Web3 ecosystem

### Competitive Advantage
- **First ERC-6551 IP Platform**: Unique token-bound account approach
- **AI Integration**: Automated infringement detection
- **Hybrid Enforcement**: Combines blockchain + traditional legal
- **Comprehensive Solution**: End-to-end IP lifecycle management
- **User Experience**: Modern, intuitive interface

---

## 👥 Team

### Leadership Team

#### **Michael Afolabi - CEO & Co-Founder**
- **Background**: 10+ years in blockchain technology
- **Expertise**: Smart contract development, DeFi protocols
- **Vision**: Democratizing IP management through blockchain
- **Previous**: Led successful DeFi & Fintech projects

#### **Casweeny Ojukwu - CTO & Technical Lead**
- **Background**: 8+ years in full-stack development
- **Expertise**: React, TypeScript, Solidity, Web3
- **Architecture**: Designed scalable blockchain applications
- **Previous**: Senior developer at major tech companies

#### **Pappu Kumar - Head of Product**
- **Background**: 6+ years in product management
- **Expertise**: User experience, market research, growth
- **Focus**: Creator-centric product development
- **Previous**: Product manager at content platforms


### Advisory Board Lead
#### **Ayanfe Olajide - Advisory Board Lead**
- **IP Law Expert**: 20+ years in intellectual property law
- **Blockchain Advisor**: Early Ethereum contributor
- **Creator Economy Expert**: Former executive at major platforms
- **AI/ML Specialist**: Machine learning professional, infringement detection

---

## 🎯 Founder-Product Fit

### Personal Motivation
The founders experienced firsthand the challenges of IP management:
- **Content Creator Struggles**: Difficulty protecting and monetizing content
- **Legal Complexity**: Expensive and time-consuming IP enforcement
- **Revenue Loss**: Unauthorized use without compensation
- **Platform Dependency**: Reliance on centralized platforms

### Technical Expertise
- **Blockchain Development**: Deep understanding of smart contracts
- **Web3 Integration**: Experience with DeFi and NFT protocols
- **AI/ML Knowledge**: Background in automated detection systems
- **Product Development**: Track record of successful applications

### Market Understanding
- **Creator Economy**: Direct experience with content creation
- **IP Law**: Understanding of legal frameworks and challenges
- **Business Development**: Network in entertainment and tech
- **User Research**: Extensive interviews with creators and IP holders

### Vision Alignment
- **Decentralization**: Belief in blockchain's transformative potential
- **Creator Empowerment**: Commitment to supporting independent creators
- **Innovation**: Drive to solve complex technical challenges
- **Impact**: Desire to create meaningful change in IP management

---

## 🗺️ Roadmap

### Phase 1: Foundation (Q3 2025) ✅ COMPLETED
- [x] Smart contract development and deployment
- [x] Frontend application with modern UI
- [x] Backend API with blockchain integration
- [x] IPFS integration for media storage
- [x] Basic IP registration and management
- [x] License management system with one-license-per-IP validation
- [x] Revenue distribution mechanisms
- [x] Yakoa infringement monitoring integration
- [x] Dispute resolution framework with arbitration system
- [x] Arbitrator registration and unstake functionality
- [x] User authentication and wallet integration
- [x] Improved nonce handling with retry logic
- [x] Enhanced error handling and user feedback

### Phase 3: Advanced Features (Q4 2025) 🚧 IN PROGRESS
- [x] Advanced licensing templates (8 predefined templates with customization)
- [x] Automated royalty calculations (real-time preview and breakdown)
- [x] Enhanced infringement detection (dashboard, auto-monitoring, severity analysis, recommendations)
- [ ] Mobile application development
- [ ] API for third-party integrations

### Phase 4: Ecosystem Expansion (Q1 2026) 📋 PLANNED
- [ ] Marketplace for IP trading
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] Enterprise features
- [ ] International expansion

### Phase 5: Scale & Optimize (Q2 2026) 🔮 FUTURE
- [ ] AI-powered IP valuation
- [ ] Advanced dispute resolution
- [ ] Global partnerships
- [ ] Regulatory compliance
- [ ] Platform governance

---

## 💰 Revenue Streams

### Primary Revenue Sources

#### 1. **Transaction Fees**
- **IP Registration**: 2.5% of registration value
- **License Sales**: 3% of license transaction value
- **Revenue Distribution**: 1% of distributed royalties
- **Dispute Resolution**: 5% of dispute settlement value

#### 2. **Subscription Services**
- **Basic Plan**: Free with limited features
- **Professional Plan**: $29/month for advanced features
- **Enterprise Plan**: $299/month for business features
- **Custom Plans**: Tailored solutions for large organizations

#### 3. **Premium Features**
- **Advanced Analytics**: $19/month
- **Priority Support**: $49/month
- **Custom Templates**: $99/month
- **API Access**: $199/month

#### 4. **Partnership Revenue**
- **Platform Integrations**: Revenue sharing with partners
- **Legal Services**: Commission from legal partners
- **Insurance Products**: Commission from IP insurance
- **Educational Content**: Revenue from IP courses

### Revenue Projections
- **Year 1**: $500K - $1M
- **Year 2**: $2M - $5M
- **Year 3**: $10M - $25M
- **Year 5**: $50M - $100M

---

## 🔮 Future Vision

### Short-term Goals (6-12 months)
- **User Acquisition**: 10,000+ registered users
- **IP Assets**: 50,000+ registered IP assets
- **Revenue**: $1M+ annual recurring revenue
- **Partnerships**: 10+ strategic partnerships

### Medium-term Goals (1-3 years)
- **Market Leadership**: Top 3 IP management platforms
- **Global Expansion**: Operations in 20+ countries
- **Enterprise Adoption**: 100+ enterprise customers
- **Ecosystem Growth**: 100+ third-party integrations

### Long-term Vision (3-5 years)
- **Industry Standard**: De facto IP management platform
- **Regulatory Influence**: Shape IP law and policy
- **Creator Economy**: Power 1M+ creators worldwide
- **Innovation Hub**: Center for IP technology innovation

### Technology Evolution
- **AI Enhancement**: Advanced infringement detection
- **Cross-chain**: Multi-blockchain support
- **Metaverse Integration**: Virtual IP management
- **Decentralized Governance**: Community-driven platform

---

## 🚀 Get Started

### Prerequisites
- Node.js 18+
- Yarn (or npm)
- Wallet with Creditcoin Testnet CTC (for gas)
- [Thirdweb](https://thirdweb.com) client ID (frontend)
- [Pinata](https://pinata.cloud) JWT (IPFS)
- Optional: Yakoa API key and subdomain (backend, for registration and infringement)

### Local development

1. **Clone and install**
   ```bash
   git clone https://github.com/your-org/fufu.git
   cd fufu
   yarn install
   ```

2. **Backend**
   - Copy `backend/src/.env.example` to `backend/.env` (or create `backend/.env`).
   - Set at least: `WALLET_PRIVATE_KEY`, `PINATA_JWT`. Optionally set `RPC_PROVIDER_URL` (must contain "creditcoin" to override default), and Yakoa vars if using registration/infringement.
   - From repo root or `backend/`: `yarn start` (or `cd backend && yarn start`). Server runs at `http://localhost:5000` and logs the RPC host and chain ID.

3. **Frontend**
   - In `app/`, create `.env` with `VITE_PINATA_JWT=your_pinata_jwt` for IPFS uploads.
   - Set your Thirdweb client ID in `app/src/main.tsx` (or via env) for wallet connect.
   - From repo root or `app/`: `yarn dev`. App runs at `http://localhost:5173` (or the port Vite prints) and uses the backend at `http://localhost:5000`.

4. **Connect**
   - Open the app, connect your wallet (Creditcoin Testnet), and use Register IP, Mint License, Pay Revenue, Claim Royalties, and Infringement from the dashboard. Ensure the backend is running for registration, licensing, and infringement checks.

### Contract addresses
The app reads addresses from `app/src/deployed_addresses.json`. Current deployed contracts on Creditcoin Testnet are listed in [Implementation Summary](#-implementation-summary). To deploy new contracts, see `DEPLOYMENT_GUIDE.md`.


---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Creditcoin**: For blockchain infrastructure support
- **Yakoa Team**: For AI-powered infringement detection
- **IPFS Team**: For decentralized storage solutions
- **Open Source Community**: For invaluable contributions

---

**Built with ❤️ by the Fufu Team**

*Empowering creators to protect and monetize their intellectual property through blockchain technology.*
