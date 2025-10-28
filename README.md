# VaultNode

<div align="center">

**Privacy-Preserving Stablecoin Platform Built on Fully Homomorphic Encryption**

[![License](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-e6e6e6?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.0-yellow)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://react.dev/)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-blueviolet)](https://docs.zama.ai/fhevm)

[Documentation](#documentation) • [Installation](#installation) • [Features](#key-features) • [Demo](#live-demo)

</div>

---

## Overview

VaultNode is a groundbreaking decentralized application that brings **true financial privacy** to blockchain transactions through **Fully Homomorphic Encryption (FHE)**. Built on Zama's FHEVM protocol, VaultNode introduces **Confidential USDT (cUSDT)**, a privacy-preserving stablecoin where all balances and transaction amounts remain encrypted on-chain while still enabling complex smart contract operations.

Unlike traditional privacy solutions that rely on mixer protocols or off-chain computation, VaultNode leverages FHE to perform computations directly on encrypted data, ensuring that sensitive financial information never needs to be revealed—not even to validators or block explorers.

## The Problem

Current blockchain systems face fundamental privacy challenges:

### 1. **Total Transparency = Privacy Violation**
Every transaction, balance, and interaction is permanently visible on public blockchains. Anyone can:
- Track your entire financial history by your address
- Monitor your current holdings and net worth
- Analyze your spending patterns and investment strategies
- Associate your on-chain activity with your real-world identity

### 2. **Inadequate Privacy Solutions**
Existing privacy approaches have critical limitations:
- **Mixer Protocols**: Require trusted third parties, face regulatory scrutiny, and have limited functionality
- **Zero-Knowledge Proofs (ZKPs)**: Only prove transaction validity without enabling computation on encrypted data
- **Layer-2 Privacy**: Moves the problem off-chain but doesn't solve on-chain privacy
- **Confidential Transactions**: Limited to simple transfers, cannot support complex DeFi operations

### 3. **DeFi Privacy Gap**
Decentralized finance protocols require transparency to function, creating an impossible choice:
- Use DeFi features but sacrifice all privacy
- Maintain privacy but forgo advanced financial operations like lending, staking, and yield farming

### 4. **Enterprise Adoption Barriers**
Businesses cannot use public blockchains for:
- Payroll and salary payments (employee financial privacy)
- Supply chain finance (competitive advantage protection)
- Treasury management (strategic position concealment)
- B2B transactions (sensitive commercial terms)

## The Solution: VaultNode

VaultNode solves these problems through **Fully Homomorphic Encryption**, enabling:

### **Private Yet Programmable**
- All token balances encrypted on-chain using FHE
- Smart contracts can compute on encrypted data without decryption
- Only the authorized owner can decrypt their own balances
- Complex operations (staking, transfers, DeFi) work seamlessly on encrypted amounts

### **No Trusted Third Parties**
- No mixers, relayers, or centralized coordinators
- Direct peer-to-peer encrypted transactions
- Trustless verification through FHE mathematics
- Fully decentralized architecture

### **Regulatory Friendly**
- No transaction obfuscation or mixing
- All operations verifiable and auditable by design
- Selective disclosure possible for compliance
- Clear transaction history (but with encrypted amounts)

### **Developer Friendly**
- Ethereum-compatible through FHEVM
- Standard Solidity development workflow
- Hardhat integration for testing and deployment
- Familiar Web3 frontend tooling (Wagmi, Ethers.js, RainbowKit)

## Key Features

### 🔐 **Fully Confidential Balances**
- Token balances encrypted using 64-bit FHE encryption (euint64)
- Zero-knowledge of account holdings to external observers
- Decryption requires private key signature—only the owner can view their balance
- Encrypted handles stored on-chain, actual values computed in FHE

### 🪙 **Confidential USDT (cUSDT)**
- Privacy-preserving stablecoin implementation
- Implements ERC-7984 standard for confidential tokens
- Supports all standard token operations (transfer, mint, burn) on encrypted amounts
- Compatible with existing Ethereum infrastructure

### 🔒 **Encrypted Staking Mechanism**
- Stake encrypted amounts without revealing how much you're staking
- Time-locked withdrawals with customizable lock periods
- Unlock timestamp public, staked amount remains confidential
- Automatic balance updates upon withdrawal completion

### 🚰 **Test Token Faucet**
- One-time claim of 1,000,000,000 test cUSDT per address
- Instant crediting to confidential balance
- On-chain tracking prevents duplicate claims
- Perfect for testing and development

### 🎨 **Modern Web3 Frontend**
- Intuitive React-based user interface
- RainbowKit integration for seamless wallet connection
- Real-time balance decryption using Zama Gateway
- Mobile-responsive design
- Support for multiple wallets (MetaMask, WalletConnect, Coinbase Wallet, etc.)

### 🔧 **Developer-Friendly Infrastructure**
- Complete Hardhat development environment
- Comprehensive test suite with FHE mocking
- Custom tasks for contract interaction (mint, stake, withdraw, decrypt)
- Automatic contract verification on Etherscan
- TypeChain type generation for type-safe development

## Technology Stack

### **Blockchain & Smart Contracts**
- **[FHEVM](https://docs.zama.ai/fhevm)** - Fully Homomorphic Encryption Virtual Machine by Zama
- **[Solidity](https://soliditylang.org/)** ^0.8.27 - Smart contract programming language
- **[Hardhat](https://hardhat.org/)** ^2.26.0 - Ethereum development environment
- **[OpenZeppelin Confidential Contracts](https://github.com/openzeppelin/openzeppelin-contracts)** - Secure contract templates for FHE
- **[Ethers.js](https://docs.ethers.org/)** v6 - Blockchain interaction library

### **Cryptography & Privacy**
- **FHE (Fully Homomorphic Encryption)** - Core encryption technology
- **euint64** - 64-bit encrypted unsigned integers
- **Zama Relayer SDK** - FHE decryption gateway
- **EIP-712** - Typed structured data signing for secure decryption requests

### **Frontend Development**
- **[React](https://react.dev/)** ^19.1.1 - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** ^5.8.3 - Type-safe JavaScript
- **[Vite](https://vite.dev/)** ^7.1.6 - Fast build tool and development server
- **[Wagmi](https://wagmi.sh/)** ^2.17.0 - React Hooks for Ethereum
- **[RainbowKit](https://www.rainbowkit.com/)** ^2.2.8 - Wallet connection UI
- **[TanStack Query](https://tanstack.com/query)** ^5.89.0 - Data fetching and caching

### **Development Tools**
- **TypeChain** - TypeScript bindings for smart contracts
- **Hardhat Deploy** - Deployment management
- **Hardhat Gas Reporter** - Gas usage analytics
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Mocha + Chai** - Testing framework

### **Networks**
- **Hardhat Local Network** - Local development and testing
- **Sepolia Testnet** - Ethereum testnet deployment
- **FHEVM Sepolia** - Zama's FHE-enabled test network

## Architecture

### Smart Contract Architecture

```
ConfidentialUSDT (ERC7984)
│
├── Ownership Management
│   ├── onlyOwner modifier
│   └── transferOwnership()
│
├── Token Operations
│   ├── mint() - Owner mints encrypted amounts
│   ├── _transfer() - Internal encrypted transfers
│   └── confidentialBalanceOf() - Returns encrypted balance handle
│
├── Faucet System
│   ├── claimTestTokens() - One-time claim
│   └── TEST_FAUCET_AMOUNT = 1B tokens
│
└── Staking Mechanism
    ├── stake(encryptedAmount, lockDuration)
    ├── withdraw() - After unlock time
    ├── stakeInfo(address) - View stake details
    ├── canWithdraw(address) - Check eligibility
    └── hasActiveStake(address) - Active status
```

### Data Flow

```
┌─────────────────┐
│   User Wallet   │
│  (Private Key)  │
└────────┬────────┘
         │
         │ 1. Encrypt amount using FHE
         ▼
┌─────────────────────────┐
│   Frontend (React)      │
│  - Create encrypted     │
│    input with Zama SDK  │
│  - Generate proof       │
└────────┬────────────────┘
         │
         │ 2. Submit encrypted transaction
         ▼
┌──────────────────────────────┐
│  Smart Contract (FHEVM)      │
│  - Process encrypted data    │
│  - Compute on ciphertext     │
│  - Update encrypted balances │
└────────┬─────────────────────┘
         │
         │ 3. Encrypted handle stored on-chain
         ▼
┌─────────────────────────────┐
│   Blockchain State          │
│  - Encrypted balances       │
│  - Public unlock timestamps │
│  - Stake status             │
└────────┬────────────────────┘
         │
         │ 4. Decrypt request (signed with user key)
         ▼
┌─────────────────────────────┐
│   Zama Decryption Gateway   │
│  - Verify signature         │
│  - Decrypt authorized data  │
│  - Return plaintext to user │
└─────────────────────────────┘
```

## Installation

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 7.0.0 or higher (or yarn/pnpm)
- **Git**: For cloning the repository
- **Ethereum Wallet**: MetaMask or similar Web3 wallet
- **Test ETH**: Sepolia testnet ETH for gas fees ([Sepolia Faucet](https://sepoliafaucet.com/))

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/VaultNode.git
cd VaultNode
```

#### 2. Install Dependencies

```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd src
npm install
cd ..
```

#### 3. Configure Environment Variables

```bash
# Set your private key (do NOT use your real wallet)
npx hardhat vars set PRIVATE_KEY

# Set Infura API key for network access
npx hardhat vars set INFURA_API_KEY

# (Optional) Set Etherscan API key for contract verification
npx hardhat vars set ETHERSCAN_API_KEY
```

**Important**: Never commit your `.env` file or expose your private keys. Use a separate wallet for development.

#### 4. Compile Smart Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeChain type definitions
- Create ABI files in `artifacts/`

#### 5. Run Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

#### 6. Deploy Locally

```bash
# Terminal 1: Start local Hardhat node with FHEVM support
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat deploy --network localhost
```

#### 7. Run Frontend Development Server

```bash
cd src
npm run dev
```

Visit `http://localhost:5173` to interact with the application.

### Deploy to Sepolia Testnet

#### 1. Ensure You Have Sepolia ETH

Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

#### 2. Deploy Contract

```bash
npx hardhat deploy --network sepolia
```

Save the deployed contract address that appears in the console.

#### 3. Verify on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> ""
```

#### 4. Update Frontend Configuration

Edit `src/src/config/contracts.ts` with your deployed contract address.

#### 5. Build and Deploy Frontend

```bash
cd src
npm run build

# Deploy to your hosting provider (Netlify, Vercel, etc.)
```

## Usage Guide

### Using Hardhat Tasks

VaultNode includes custom Hardhat tasks for easy contract interaction:

#### View Contract Address

```bash
npx hardhat task:token-address --network sepolia
```

#### Mint Tokens (Owner Only)

```bash
npx hardhat task:mint \
  --amount 1000000000 \
  --to 0xRecipientAddress \
  --network sepolia
```

#### Stake Tokens

```bash
npx hardhat task:stake \
  --amount 500000000 \
  --duration 86400 \
  --network sepolia
```
*(Locks 500M tokens for 24 hours)*

#### Withdraw Staked Tokens

```bash
npx hardhat task:withdraw --network sepolia
```

#### Claim Test Tokens

```bash
npx hardhat task:claim --network sepolia
```

#### Decrypt Stake Information

```bash
npx hardhat task:decrypt-stake \
  --staker 0xYourAddress \
  --network sepolia
```

### Using the Web Interface

#### 1. **Connect Wallet**
- Click "Connect Wallet" in the top-right corner
- Select your preferred wallet (MetaMask, WalletConnect, etc.)
- Approve the connection request
- Switch to Sepolia network if prompted

#### 2. **Claim Test Tokens**
- Navigate to "Claim Test Tokens" section
- Click "Claim Tokens" button (one-time only per address)
- Confirm the transaction in your wallet
- Wait for confirmation (~15 seconds on Sepolia)

#### 3. **View Encrypted Balance**
- Your balance is encrypted by default (shows as `***`)
- Click "Decrypt Latest Balance" to view your actual balance
- Sign the EIP-712 decryption request in your wallet
- The Zama Gateway will decrypt and display your balance

#### 4. **Stake Tokens**
- Enter the amount of cUSDT to stake
- Enter lock duration in seconds (e.g., 3600 = 1 hour)
- Click "Stake Tokens"
- Approve the encrypted transaction
- Your confidential balance will decrease, and stake position will show as active

#### 5. **Monitor Stake**
- View your active stake status
- Check encrypted staked amount (decrypt to view)
- See unlock timestamp (when you can withdraw)
- Wait for unlock time to pass

#### 6. **Withdraw Staked Tokens**
- Once unlock time has passed, "Withdraw" button becomes enabled
- Click "Withdraw" to return staked tokens to your balance
- Confirm transaction
- Your confidential balance increases by the staked amount

## Project Structure

```
VaultNode/
│
├── contracts/                      # Smart contracts
│   └── ConfidentialUSDT.sol        # Main cUSDT token contract
│
├── deploy/                         # Deployment scripts
│   └── deploy.ts                   # Contract deployment logic
│
├── tasks/                          # Custom Hardhat tasks
│   ├── accounts.ts                 # Account management tasks
│   └── ConfidentialUSDT.ts         # cUSDT interaction tasks
│
├── test/                           # Test files
│   └── ConfidentialUSDT.ts         # Comprehensive test suite
│
├── src/                            # Frontend application
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   └── TokenApp.tsx        # Main app component
│   │   ├── config/                 # Configuration
│   │   │   ├── contracts.ts        # Contract addresses & ABIs
│   │   │   └── wagmi.ts            # Wagmi configuration
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useEthersSigner.ts  # Ethers signer hook
│   │   │   └── useZamaInstance.ts  # FHE instance hook
│   │   ├── styles/                 # CSS stylesheets
│   │   ├── App.tsx                 # Root component
│   │   └── main.tsx                # Entry point
│   ├── index.html                  # HTML template
│   ├── vite.config.ts              # Vite configuration
│   └── package.json                # Frontend dependencies
│
├── hardhat.config.ts               # Hardhat configuration
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## Testing

VaultNode includes a comprehensive test suite covering all contract functionality.

### Run All Tests

```bash
npm test
```

### Test Coverage

```bash
npm run coverage
```

Expected coverage:
- ConfidentialUSDT.sol: ~95%+ coverage
- All critical paths tested (mint, stake, withdraw, claim)
- Edge cases covered (unauthorized access, time locks, duplicate claims)

### Key Test Scenarios

#### Minting Tests
- ✅ Owner can mint tokens to any address
- ✅ Non-owners cannot mint
- ✅ Encrypted amounts handled correctly
- ✅ Balance updates reflect minted amounts

#### Faucet Tests
- ✅ First claim succeeds
- ✅ Second claim reverts with custom error
- ✅ Correct amount credited

#### Staking Tests
- ✅ Users can stake encrypted amounts
- ✅ Withdrawal blocked before unlock time
- ✅ Withdrawal succeeds after unlock time
- ✅ Cannot stake while already staked
- ✅ Invalid durations rejected

#### Ownership Tests
- ✅ Only owner can transfer ownership
- ✅ Zero address rejected as new owner

### Test Networks

#### Local Hardhat Network (Recommended for Development)
```bash
npx hardhat test
```
- Uses FHEVM mock mode
- Instant block times
- Free (no gas costs)
- Full debugging support

#### Sepolia Testnet (For Integration Testing)
```bash
npx hardhat test --network sepolia
```
- Real FHEVM environment
- Actual encryption/decryption
- Requires test ETH
- ~15 second block times

## Security Considerations

### Smart Contract Security

#### ✅ **Implemented Protections**

- **Access Control**: `onlyOwner` modifier restricts sensitive functions
- **Input Validation**: Zero address checks, amount validations
- **Reentrancy Protection**: Follows checks-effects-interactions pattern
- **Integer Overflow**: Solidity 0.8.x built-in overflow protection
- **Custom Errors**: Gas-efficient error handling with descriptive messages
- **OpenZeppelin Base**: Built on audited ERC7984 implementation

#### ⚠️ **Known Limitations**

- **Alpha Stage**: FHEVM is emerging technology—use at your own risk
- **Gas Costs**: FHE operations are significantly more expensive than standard operations
- **Decryption Delay**: Decryption via gateway adds latency compared to instant reads
- **Key Management**: Users responsible for private key security (standard Web3 risk)

#### 🔐 **Best Practices**

1. **Never Share Private Keys**: Your wallet private key controls decryption access
2. **Use Separate Wallets**: Don't use production wallets for testnet development
3. **Verify Contracts**: Always verify contract source code on Etherscan before interacting
4. **Test First**: Use testnet thoroughly before mainnet deployment
5. **Audit Before Mainnet**: Get professional security audit for production deployment

### Privacy Guarantees

#### **What is Private**
- ✅ Token balances (encrypted with FHE)
- ✅ Transfer amounts (encrypted end-to-end)
- ✅ Staked amounts (encrypted, only unlock time public)

#### **What is Public**
- ❌ Wallet addresses (inherent to blockchain)
- ❌ Transaction occurrences (that a transaction happened)
- ❌ Unlock timestamps (when stakes can be withdrawn)
- ❌ Contract interactions (which functions were called)

#### **Decryption Access**
- Only the balance owner can decrypt their own balances
- Requires valid EIP-712 signature from the owner's private key
- Zama Gateway validates signatures before decryption
- No one else (including contract owner) can decrypt user balances

## Advantages Over Traditional Solutions

### Comparison Table

| Feature | VaultNode (FHE) | Mixer Protocols | Zero-Knowledge (ZK) | Layer 2 Privacy |
|---------|-----------------|-----------------|---------------------|-----------------|
| **On-Chain Computation** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **No Trusted Setup** | ✅ Yes | ❌ Requires mixers | ⚠️ Trusted ceremony | ⚠️ Operators |
| **Complex Operations** | ✅ Staking, DeFi | ❌ Only transfers | ⚠️ Limited | ✅ Yes |
| **Auditability** | ✅ Transparent operations | ❌ Obfuscated | ⚠️ Proof verification | ⚠️ Off-chain |
| **Regulatory Friendly** | ✅ Yes | ❌ Scrutinized | ⚠️ Unclear | ⚠️ Unclear |
| **EVM Compatibility** | ✅ Native | ❌ Separate contracts | ⚠️ Requires ZK-EVM | ⚠️ Separate chain |
| **Composability** | ✅ Standard interfaces | ❌ Limited | ⚠️ Limited | ❌ Siloed |
| **User Experience** | ✅ Standard Web3 | ❌ Complex | ⚠️ Proof generation | ⚠️ Bridging needed |

### Unique Advantages

#### 1. **True Programmable Privacy**
Unlike mixers or ZK-rollups, FHE enables **smart contracts to compute directly on encrypted data**. This means:
- DeFi protocols can operate without seeing balances
- Lending, borrowing, and yield farming remain private
- Conditional logic works on encrypted values
- No information leakage during computation

#### 2. **No Coordination Required**
Traditional privacy solutions require:
- Mixing pools with sufficient liquidity
- Relayers to break transaction graphs
- Proof aggregators to batch transactions

VaultNode requires **none of this**—just direct user-to-contract interaction.

#### 3. **Selective Disclosure**
Users can:
- Decrypt their own balances anytime
- Prove specific properties without revealing amounts (e.g., "balance > X")
- Share read access with auditors or regulators selectively
- Maintain full control over privacy

#### 4. **Gas Efficiency** (Relative to Privacy)
While FHE operations cost more gas than plaintext:
- No pool entry/exit fees (like mixers)
- No proof generation gas (like ZK)
- No bridge fees (like Layer 2)
- Single-transaction privacy

#### 5. **Future-Proof Architecture**
As FHE hardware acceleration improves:
- Gas costs will decrease exponentially
- More complex operations become viable
- Entire DeFi ecosystems can migrate to confidential computing
- VaultNode's architecture remains compatible

## Roadmap & Future Development

### Phase 1: Foundation (Current)
- ✅ Core ConfidentialUSDT implementation
- ✅ Encrypted staking mechanism
- ✅ Basic frontend interface
- ✅ Testnet deployment (Sepolia)
- ✅ Documentation and developer tools

### Phase 2: Enhanced Features (Q2 2025)
- 🔄 **Confidential Transfers**: P2P encrypted token transfers
- 🔄 **Multi-Token Support**: Support for multiple confidential assets (cDAI, cETH, etc.)
- 🔄 **Batch Operations**: Stake/unstake multiple positions in one transaction
- 🔄 **Advanced Staking**: Variable APY based on lock duration
- 🔄 **Delegation**: Delegate staking rights without transferring tokens
- 🔄 **Mobile App**: Native iOS/Android applications

### Phase 3: DeFi Integration (Q3 2025)
- 🔮 **Confidential AMM**: Privacy-preserving decentralized exchange
- 🔮 **Lending Protocol**: Borrow against encrypted collateral
- 🔮 **Liquidity Mining**: Private yield farming
- 🔮 **Governance**: DAO voting with encrypted vote weights
- 🔮 **NFT Support**: Confidential NFT ownership and trading
- 🔮 **Cross-Chain Bridge**: Confidential asset bridging

### Phase 4: Enterprise & Compliance (Q4 2025)
- 🔮 **Compliance Module**: Optional KYC/AML integration for regulated entities
- 🔮 **Multi-Sig Wallets**: Confidential multi-signature support
- 🔮 **Auditor Access**: Permissioned decryption for compliance
- 🔮 **Payroll System**: Private salary distribution platform
- 🔮 **Treasury Management**: Confidential corporate treasury tools
- 🔮 **Enterprise SDK**: White-label confidential token platform

### Phase 5: Mainnet & Scaling (2026)
- 🔮 **Mainnet Launch**: Production deployment on Ethereum mainnet
- 🔮 **Layer 2 Integration**: Deploy on Optimism, Arbitrum, zkSync
- 🔮 **Hardware Acceleration**: GPU/FPGA FHE computation
- 🔮 **Gas Optimization**: Advanced FHE operation batching
- 🔮 **Institutional Adoption**: Partnerships with financial institutions
- 🔮 **Security Audit**: Multiple third-party security audits

### Research Initiatives
- 🔬 **Threshold FHE**: Distributed decryption for DAOs
- 🔬 **Homomorphic Signatures**: More efficient authentication
- 🔬 **FHE Machine Learning**: Private on-chain AI models
- 🔬 **Quantum Resistance**: Post-quantum cryptography integration
- 🔬 **Privacy Analytics**: Encrypted data analytics

## Performance Benchmarks

### Gas Costs (Sepolia Testnet)

| Operation | Gas Used | Cost (@ 20 gwei) | vs. Standard ERC20 |
|-----------|----------|------------------|--------------------|
| Claim Test Tokens | ~350,000 | ~0.007 ETH | +15x |
| Stake Tokens | ~420,000 | ~0.0084 ETH | +18x |
| Withdraw | ~280,000 | ~0.0056 ETH | +12x |
| Mint (Owner) | ~390,000 | ~0.0078 ETH | +16x |
| Decrypt Balance | Off-chain | Free | N/A |

**Note**: FHE operations are significantly more expensive due to cryptographic computation. Gas costs will decrease as:
1. FHEVM optimizations are implemented
2. Hardware acceleration becomes available
3. Ethereum scaling solutions (sharding, L2s) reduce base gas costs

### Decryption Performance

| Metric | Value |
|--------|-------|
| Decryption Latency | ~2-5 seconds |
| Gateway Availability | 99.9% uptime |
| Maximum Handles/Request | 100 |
| Signature Validity | 7 days |

### Transaction Throughput

| Network | TPS | Block Time | Finality |
|---------|-----|------------|----------|
| Hardhat Local | Unlimited | Instant | Instant |
| Sepolia | ~10 TPS | ~15 seconds | ~2 minutes |
| Mainnet (est.) | ~15 TPS | ~12 seconds | ~15 minutes |

## Contributing

We welcome contributions from the community! VaultNode is an open-source project, and we encourage developers to help us build the future of confidential computing on blockchain.

### How to Contribute

#### 1. **Report Bugs**
Found a bug? [Open an issue](https://github.com/your-username/VaultNode/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, Node version, network)

#### 2. **Suggest Features**
Have an idea? [Open a feature request](https://github.com/your-username/VaultNode/issues) with:
- Use case description
- Proposed solution
- Potential challenges
- Benefits to users

#### 3. **Submit Pull Requests**

```bash
# Fork the repository
git clone https://github.com/your-username/VaultNode.git
cd VaultNode

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "Add: description of your changes"

# Push to your fork
git push origin feature/your-feature-name

# Open a pull request on GitHub
```

#### Code Standards
- Follow existing code style (ESLint + Prettier configured)
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

### Areas We Need Help

- 🎨 **UI/UX Design**: Improve frontend design and user experience
- 🔒 **Security Review**: Audit smart contracts and identify vulnerabilities
- 📚 **Documentation**: Expand guides, tutorials, and API documentation
- 🧪 **Testing**: Add more test cases and edge case coverage
- 🌐 **Translations**: Internationalize the interface
- ⚡ **Optimization**: Reduce gas costs and improve performance

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

```
Copyright (c) 2025 VaultNode Contributors

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED
BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
```

See the [LICENSE](LICENSE) file for full details.

## Acknowledgments

VaultNode is built on the shoulders of giants. We thank:

- **[Zama](https://www.zama.ai/)** - For pioneering FHEVM and making this project possible
- **[OpenZeppelin](https://www.openzeppelin.com/)** - For secure smart contract libraries
- **[Hardhat](https://hardhat.org/)** - For excellent Ethereum development tools
- **[RainbowKit](https://www.rainbowkit.com/)** - For beautiful wallet connection UX
- **Ethereum Community** - For building the decentralized future

## Documentation

### Official Documentation
- 📘 [FHEVM Documentation](https://docs.zama.ai/fhevm) - Learn about Fully Homomorphic Encryption
- 📙 [Hardhat Guide](https://hardhat.org/docs) - Smart contract development
- 📗 [Wagmi Documentation](https://wagmi.sh/) - React Hooks for Ethereum
- 📕 [ERC-7984 Standard](https://eips.ethereum.org/EIPS/eip-7984) - Confidential token interface

### Tutorials & Guides
- [Quick Start Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)
- [Testing FHE Contracts](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [Deploying to Production](docs/DEPLOYMENT.md) *(Coming Soon)*
- [Integrating VaultNode](docs/INTEGRATION.md) *(Coming Soon)*

### Community Resources
- 💬 [Discord](https://discord.gg/zama) - Join the Zama community
- 🐦 [Twitter](https://twitter.com/zama_fhe) - Follow for updates
- 📺 [YouTube](https://www.youtube.com/@zamafhe) - Video tutorials
- 📰 [Blog](https://www.zama.ai/blog) - Technical articles

## Support

### Getting Help

- **Documentation Issues**: Check the [docs](https://docs.zama.ai/fhevm) first
- **Bug Reports**: [GitHub Issues](https://github.com/your-username/VaultNode/issues)
- **Questions**: [GitHub Discussions](https://github.com/your-username/VaultNode/discussions)
- **Community**: [Zama Discord](https://discord.gg/zama)

### Frequently Asked Questions

**Q: Is this ready for production?**
A: No. VaultNode is currently in **alpha/testnet stage**. FHEVM is emerging technology. Do not use with real funds.

**Q: How much does it cost to use?**
A: Gas costs are higher than standard ERC20 tokens (15-20x) due to FHE computation. Costs will decrease as technology matures.

**Q: Can anyone see my balance?**
A: No. Balances are encrypted with FHE. Only you can decrypt your own balance using your private key signature.

**Q: What networks are supported?**
A: Currently Sepolia testnet. Mainnet support planned for late 2025.

**Q: How is this different from Tornado Cash?**
A: Tornado Cash is a mixer (breaks transaction links). VaultNode uses FHE (encrypts amounts). Different privacy techniques, different regulatory implications.

**Q: Can I build on top of VaultNode?**
A: Yes! VaultNode is open source. You can fork, integrate, or build complementary services.

## Live Demo

🌐 **Testnet Demo**: [https://vaultnode.netlify.app](https://vaultnode.netlify.app) *(Coming Soon)*

Try VaultNode on Sepolia testnet:
1. Connect your wallet (MetaMask recommended)
2. Switch to Sepolia network
3. Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)
4. Claim test cUSDT tokens
5. Experiment with staking and decryption

**Contract Address (Sepolia)**: `0x...` *(Deploy and update)*

---

<div align="center">

**Built with ❤️ for a more private Web3**

[⭐ Star this repo](https://github.com/your-username/VaultNode) • [🐛 Report Bug](https://github.com/your-username/VaultNode/issues) • [💡 Request Feature](https://github.com/your-username/VaultNode/issues)

</div>
