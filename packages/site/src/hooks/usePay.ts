import { useEffect, useMemo, useState } from 'react'
import { useAccount } from './useAccount'
import { TokenInfo } from '@/types/token'
import { BigNumber } from 'ethers'

export const usePay = (chainId: string, symbol: string) => {
	const { tokens } = useAccount()
	const [currentChain, setCurrentChain] = useState<number>(parseInt(chainId))
	const [token, setToken] = useState<TokenInfo>()

	const availableTokens = useMemo(() => {
		return tokens.filter((token) => token.chainId === currentChain)
	}, [currentChain, tokens])

	const SINGLE_GAS_RESULT = useMemo(() => {
		return [
			{
				chainId: 137,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
						gasLimit: BigNumber.from(100000)
					},
					{
						symbol: 'USDT',
						token: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
						gasLimit: BigNumber.from(100000)
					}
				]
			},
			{
				chainId: 80001,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0x87F0E95E11a49f56b329A1c143Fb22430C07332a',
						gasLimit: BigNumber.from(100000)
					},
					{
						symbol: 'USDT',
						token: '0x569F5fF11E259c8e0639b4082a0dB91581a6b83e',
						gasLimit: BigNumber.from(100000)
					}
				]
			},
			{
				chainId: 42161,
				gasOption: [
					{
						symbol: 'USDC',
						token: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
						gasLimit: BigNumber.from(100000)
					},
					{
						symbol: 'USDT',
						token: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
						gasLimit: BigNumber.from(100000)
					}
				]
			}
		]
	}, [])

	const SINGLE_GAS = useMemo(() => {
		const singleGas = SINGLE_GAS_RESULT.find((gasOption) => gasOption.chainId === currentChain)
		return singleGas?.gasOption
	}, [currentChain, SINGLE_GAS_RESULT])

	useEffect(() => {
		const token = tokens.find((token) => token.symbol === symbol && token.chainId === currentChain)
		token && setToken(token)
	}, [currentChain, symbol, tokens])

	return { setToken, token, currentChain, setCurrentChain, availableTokens, SINGLE_GAS }
}
