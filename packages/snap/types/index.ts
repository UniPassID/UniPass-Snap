import { BigNumber } from 'ethers'

export type AuthenticationInput = {
	address: string
}

export interface Transaction {
	amount: string
	to: string
	token: string
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

export type SignTxMessageInput = {
	message: string
	originTransaction: string
}

export interface FeeTx {
	token: string
	name?: string
	symbol?: string
	decimals?: number
	to: string
	amount: BigNumber
	error?: string
}
