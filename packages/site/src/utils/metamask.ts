/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlaskVersion = async (): Promise<boolean> => {
	try {
		const provider = window.ethereum
		const clientVersion = (await provider?.request({
			method: 'web3_clientVersion'
		})) as string[]

		return Boolean(provider && clientVersion.includes('flask'))
	} catch (error) {
		console.error(error)
		return false
	}
}
