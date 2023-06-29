import type { providers } from 'ethers'

export interface ApiResponse<T> {
	statusCode: number
	message?: string
	error?: string
	data: T
}

export interface SignOutPut {
	guideStatus: number
	accessToken: string
	isNewAccount: boolean
}

export interface SignInput {
	accountAddress: string
	providerIdentifier: string
	providerType?: string
}

export interface GetFreeQuotaOutput {
	availableFreeQuota: number
	totalFreeQuota: number
}

export interface SingleTransactionFee {
	token: string
	chainId: number
	singleFee: number
	feeReceiver: string
}

export interface SingleTransactionFeesOutput {
	fees: SingleTransactionFee[]
}

export interface AuthorizeTxFeesInput {
	nonce: number
	chainId: number
	usedFreeQuota: number
	tokenSingleFees?: {
		token: string
		singleFee: number
	}[]
	transactions: providers.TransactionRequest[]
	feeTransaction: providers.TransactionRequest
}

export interface AuthorizeTxFeesOutput {
	freeSig: string
	expires: number
}

export interface VerifyTxFeesOutput {
	success: boolean
	errorReason: string
}
