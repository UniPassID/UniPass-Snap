import { Wallet } from 'ethers'

export async function getMasterKeyAddress(): Promise<string> {
	const entropy = await snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})

	return new Wallet(entropy).address
}

export async function signMessage(message: string): Promise<string> {
	const entropy = await snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})

	return await new Wallet(entropy).signMessage(message)
}
