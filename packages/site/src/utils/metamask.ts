import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

/**
 * Detect if the wallet injecting the ethereum object is Metamask.
 *
 * @returns True if the MetaMask version is not undefined, false otherwise.
 */
export const isMetaMaskVersion = async (): Promise<boolean> => {
	try {
		const provider = window.ethereum
		// @ts-ignore
		const clientVersion = (await provider?.request({
			method: 'web3_clientVersion'
		})) as string[]

		return Boolean(provider && !!clientVersion)
	} catch (error) {
		console.error(error)
		return false
	}
}

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))
