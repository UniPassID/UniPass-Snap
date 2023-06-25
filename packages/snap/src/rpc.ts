import { Bytes, Wallet } from 'ethers'
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

export async function signMessage(message: string | Bytes): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).signMessage(message)
}

export async function signTransaction(transaction: TransactionRequest): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).signTransaction(transaction)
}

export async function getSignSig(address: string): Promise<{ loginMessage: string; loginSignature: string }> {
	const entropy = await getEntropy()
	const loginMessage = `UniPass Snap is requesting to sign in at ${new Date().toISOString()} with your UniPass Snap account: ${address}`
	const loginSignature = await new Wallet(entropy).signMessage(loginMessage)
	return {
		loginMessage,
		loginSignature
	}
}
