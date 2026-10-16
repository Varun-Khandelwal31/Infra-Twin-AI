export type BlockchainNetwork = 'Polygon Amoy' | 'Arbitrum Sepolia' | 'Hyperledger Besu (Gov Intranet)';

export type EscrowStatus =
  | 'FUNDED'
  | 'UNDER_AUDIT'
  | 'APPROVED_RELEASED'
  | 'PAYMENT_FROZEN'
  | 'SLASHED';

export interface MerkleLeaf {
  id: string;
  label: string;
  hash: string;
  dataSummary: string;
}

export interface MerkleTreeProof {
  root: string;
  leaves: MerkleLeaf[];
  depth: number;
  generatedAt: string;
}

export interface BlockchainTransactionReceipt {
  txHash: string;
  blockNumber: number;
  blockHash: string;
  network: BlockchainNetwork;
  chainId: number;
  from: string;
  toContract: string;
  gasUsed: string;
  gasFeeMatic: string;
  timestamp: string;
  merkleRoot: string;
  section65BDigest: string;
  status: 'SUCCESS' | 'PENDING' | 'REVERTED';
  explorerUrl: string;
}

export interface OnChainAuditRecord {
  inspectionId: string;
  roadId: string;
  roadName: string;
  city: string;
  contractor: string;
  billedVolumeCum: number;
  verifiedVolumeCum: number;
  materialVariancePct: number;
  compactionDensityPct: number;
  pciScore: number;
  isFraud: boolean;
  escrowStatus: EscrowStatus;
  merkleProof: MerkleTreeProof;
  receipt: BlockchainTransactionReceipt;
}

export interface Web3WalletState {
  isConnected: boolean;
  address: string;
  balanceMatic: string;
  network: BlockchainNetwork;
  role: 'Municipal Chief Engineer' | 'DGCA Certified UAV Auditor' | 'Contractor Representative';
}
