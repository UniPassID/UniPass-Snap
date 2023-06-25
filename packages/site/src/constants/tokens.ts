import { TokenInfo } from '@/types'
import { ARBITRUM_MAINNET, CHAIN_CONFIGS } from './chains'
import { BigNumber } from 'ethers'

export const DEFAULT_TOKEN_LIST: TokenInfo[] | undefined = CHAIN_CONFIGS.find(
	(chain) => chain.chainId === ARBITRUM_MAINNET
)?.tokens.map((token) => {
	return {
		...token,
		balance: BigNumber.from(0)
	}
})

export function getDefaultTokenList(chainIds: number[]): TokenInfo[] {
  return CHAIN_CONFIGS.filter((chain) => chainIds.includes(chain.chainId)).map(chain => {
		return chain.tokens.map((token) => {
			return {
				...token,
				balance: BigNumber.from(0)
			}
		})
	}).flat()
}
