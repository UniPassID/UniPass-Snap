import { Wallet } from 'ethers'

export async function getMasterKeyAddress(): Promise<string> {
	const entropy = await snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})
	console.log('new Wallet(entropy).address:', new Wallet(entropy).address, entropy)
	return entropy
}
