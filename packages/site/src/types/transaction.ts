export enum TransactionStatus {
	Pending = 'PENDING',
	Failed = 'FAILED',
	Success = 'SUCCESS'
}

export interface Transaction {
	amount: string
	to: string
	token: string
}

export interface Fee {
	amount: string
	token: string
	to: string
}

export interface Transactions {
	txs: Transaction[]
}

export interface TransactionRecord {
	relayerHash: string
	hash?: string
  chainId: number
	txs: Transaction[]
	status: TransactionStatus
	timestamp: number
	fee?: Fee
	originFee?: number
  error?: string
}

export interface OriginTransaction {
	transactions: Transaction[]
	chain: string
	chainId: number
	nonce: number
	address: string
	fee?: {
		to: string
		token: string
		amount: string
	}
}
