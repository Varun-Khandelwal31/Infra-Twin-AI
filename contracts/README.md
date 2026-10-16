# ⛓️ InfraTwin AI — Smart Contract Suite

This directory contains the production Solidity smart contracts powering **InfraTwin AI's** decentralized municipal governance and autonomous payment settlement engine:

## Contracts
1. **`InfraTwinRegistry.sol`**:
   - Stores immutable on-chain proof of drone inspections, LiDAR volumetric Merkle roots, and Section 65B electronic audit certificates.
2. **`InfraEscrow.sol`**:
   - Holds municipal tender budgets in smart contract escrow.
   - Autonomous AI Oracle triggers milestone release upon $\ge 95\%$ compaction and $\le \pm 5\%$ material variance.
   - Autonomously freezes payments on PFMS/GeM and slashes contractor stake on fraud detection.
3. **`ContractorReputation.sol`**:
   - Dynamic on-chain credit scoring (0–100) and blacklisting for highway contractors based on multi-year Defect Liability Period (DLP) durability.

## Deployments
- **Target Network**: Polygon Amoy Testnet (Chain ID `80002`) / Hyperledger Besu
- **Compiler Version**: Solidity `^0.8.20`
- **License**: MIT
