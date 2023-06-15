export const MULTICALL_ADDRESS = '0x175d02d277eac0838af14D09bf59f11B365BAB42'

// polygon
export const POLYGON_MAINNET = 137
export const POLYGON_MUMBAI = 80001

// arbitrum
export const ARBITRUM_MAINNET = 42161

// avax
// export const AVALANCHE_MAINNET = 43114

export const CHAIN_CONFIGS = [
	{
		name: 'polygon-mumbai',
		chainId: POLYGON_MUMBAI,
		rpcUrl: 'https://node.wallet.unipass.id/polygon-mumbai',
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
		rpcUrl: 'https://node.wallet.unipass.id/polygon-mainnet',
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
		rpcUrl: 'https://node.wallet.unipass.id/arbitrum-mainnet',
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
	// {
	// 	name: 'avalanche-mainnet',
	// 	chainId: AVALANCHE_MAINNET,
	// 	rpcUrl: 'https://node.wallet.unipass.id/avalanche-mainnet',
	// 	tokens: [
	// 		{
	// 			chainId: AVALANCHE_MAINNET,
	// 			contractAddress: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
	// 			name: 'USD Coin',
	// 			symbol: 'USDC',
	// 			decimals: 6
	// 		},
	// 		{
	// 			chainId: AVALANCHE_MAINNET,
	// 			contractAddress: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
	// 			name: 'TetherToken',
	// 			symbol: 'USDT',
	// 			decimals: 6
	// 		}
	// 	],
	// 	explorer: 'https://snowtrace.io'
	// }
]

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
