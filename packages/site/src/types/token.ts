import { BigNumber } from 'ethers'

export interface TokenInfo {
	name: string
	symbol: string
	contractAddress: string
	chainId: number
	decimals: number
	price?: number
	balance?: BigNumber
}
