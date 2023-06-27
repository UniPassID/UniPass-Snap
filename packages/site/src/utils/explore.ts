import { CHAIN_CONFIGS } from '@/constants'

const openExplore = (chainId: number, hashOrAddress: string, type: 'address' | 'tx') => {
	const token = CHAIN_CONFIGS.find((chain) => chainId === chain.chainId)

	if (token) {
		window.open(`${token.explorer}/${type}/${hashOrAddress}`, '_blank')
	}
}

export { openExplore }
