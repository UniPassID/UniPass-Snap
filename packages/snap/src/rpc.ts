import { Wallet } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'

function getEntropy() {
	return snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})
}

export async function getMasterKeyAddress(): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).address
}

export async function signMessage(message: string): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).signMessage(message)
}

export async function signTransaction(transaction: TransactionRequest): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).signTransaction(transaction)
}
