import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { currentChainIdState, smartAccountTokenListState } from '@/store'
import { useRecoilValue } from 'recoil'

export const usePay = () => {
	const tokens = useRecoilValue(smartAccountTokenListState)
	const chainId = useRecoilValue(currentChainIdState)

	const availableTokens = useMemo(() => {
		return tokens.filter((token) => token.chainId === chainId)
	}, [chainId, tokens])

	const SINGLE_GAS_RESULT = useMemo(() => {
		return [
			{
				chainId: 137,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					},
					{
						symbol: 'USDT',
						token: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					}
				]
			},
			{
				chainId: 80001,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0x87F0E95E11a49f56b329A1c143Fb22430C07332a',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					},
					{
						symbol: 'USDT',
						token: '0x569F5fF11E259c8e0639b4082a0dB91581a6b83e',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					}
				]
			},
			{
				chainId: 42161,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					},
					{
						symbol: 'USDT',
						token: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
						amount: BigNumber.from(100000),
						decimals: 6,
						to: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
					}
				]
			}
		]
	}, [])

	const SINGLE_GAS = useMemo(() => {
		const singleGas = SINGLE_GAS_RESULT.find((gasOption) => gasOption.chainId === chainId)
		return singleGas?.gasOption
	}, [chainId, SINGLE_GAS_RESULT])

	return { availableTokens, SINGLE_GAS }
}
