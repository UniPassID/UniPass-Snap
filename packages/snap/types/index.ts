export type AuthenticationInput = {
	address: string
}

export interface Transaction {
	amount: string
	to: string
	token: string
}

export interface originTransaction {
	transactions: Transaction[]
	chain: string
	fee?: {
		symbol: string
		amount: string
	}
}

export type SignTxMessageInput = {
	message: string
	originTransaction: string
}
