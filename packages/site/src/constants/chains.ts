import type { AddEthereumChainParameter } from '@web3-react/types'
export const MULTICALL_ADDRESS = '0x175d02d277eac0838af14D09bf59f11B365BAB42'

// polygon
export const POLYGON_MAINNET = 137
export const POLYGON_MUMBAI = 80001

// arbitrum
export const ARBITRUM_MAINNET = 42161

// avax
// export const AVALANCHE_MAINNET = 43114

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
	name: 'Ether',
	symbol: 'ETH',
	decimals: 18
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
	name: 'Matic',
	symbol: 'MATIC',
	decimals: 18
}

export const CHAIN_CONFIGS = [
	{
		name: 'polygon-mumbai',
		chainId: POLYGON_MUMBAI,
		metaMaskRpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
		rpcUrl: 'https://node.wallet.unipass.id/polygon-mumbai',
		nativeCurrency: MATIC,
		tokens: [
			{
				chainId: POLYGON_MUMBAI,
				contractAddress: '0x87F0E95E11a49f56b329A1c143Fb22430C07332a',
				name: 'USDC',
				symbol: 'USDC',
				decimals: 6
			},
			{
				chainId: POLYGON_MUMBAI,
				contractAddress: '0x569F5fF11E259c8e0639b4082a0dB91581a6b83e',
				name: 'USDT',
				symbol: 'USDT',
				decimals: 6
			}
		],
		explorer: 'https://mumbai.polygonscan.com'
	},
	{
		name: 'polygon-mainnet',
		chainId: POLYGON_MAINNET,
		metaMaskRpcUrl: 'https://polygon-rpc.com',
		rpcUrl: 'https://node.wallet.unipass.id/polygon-mainnet',
		nativeCurrency: MATIC,
		tokens: [
			{
				chainId: POLYGON_MAINNET,
				contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
				name: 'USDC',
				symbol: 'USDC',
				decimals: 6
			},
			{
				chainId: POLYGON_MAINNET,
				contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
				name: 'Tether',
				symbol: 'USDT',
				decimals: 6
			}
		],
		explorer: 'https://polygonscan.com'
	},
	{
		name: 'arbitrum-mainnet',
		chainId: ARBITRUM_MAINNET,
		metaMaskRpcUrl: 'https://arb1.arbitrum.io/rpc',
		rpcUrl: 'https://node.wallet.unipass.id/arbitrum-mainnet',
		nativeCurrency: ETH,
		tokens: [
			{
				chainId: ARBITRUM_MAINNET,
				contractAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
				name: 'USDC',
				symbol: 'USDC',
				decimals: 6
			},
			{
				chainId: ARBITRUM_MAINNET,
				contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
				name: 'USDT',
				symbol: 'USDT',
				decimals: 6
			}
		],
		explorer: 'https://arbiscan.io'
	}
]

export const MAINNET_CHAIN_IDS = [POLYGON_MAINNET, ARBITRUM_MAINNET]
export const TESTNET_CHAIN_IDS = [POLYGON_MUMBAI]

export const getChainNameByChainId = (chainId: number) => {
	switch (chainId) {
		case POLYGON_MUMBAI:
			return 'Polygon-Mumbai'
		case POLYGON_MAINNET:
			return 'Polygon'
		case ARBITRUM_MAINNET:
			return 'Arbitrum'

		default:
			return ''
	}
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
	const chainInformation = CHAIN_CONFIGS.find((item) => item.chainId === chainId)
	if (!chainInformation) throw new Error(`chain ${chainId} not support yet`)
	return {
		chainId,
		chainName: chainInformation.name,
		nativeCurrency: chainInformation.nativeCurrency,
		rpcUrls: [chainInformation.metaMaskRpcUrl],
		blockExplorerUrls: [chainInformation.explorer]
	}
}
