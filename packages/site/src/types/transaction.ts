import { BigNumber } from 'ethers'

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
	amount: BigNumber
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
	discount?: number
	fee?: Fee
  error?: string
}

export interface originTransaction {
	transactions: Transaction[]
	chain: string
	fee?: {
		symbol: string
		amount: string
	}
}
