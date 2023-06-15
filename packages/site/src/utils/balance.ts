import { BigNumber } from 'ethers'
import { aggregate, ICall } from 'makerdao-multicall'
import { TokenInfo } from '@/types/token'
import { MULTICALL_ADDRESS } from '@/constants'

export const getBalancesByMulticall = async (
	account: string,
	tokens: Array<TokenInfo>,
	rpcUrl: string
): Promise<Array<TokenInfo>> => {
	try {
		const calls: Array<Partial<ICall>> = tokens.map(({ contractAddress }) => {
			return {
				target: contractAddress,
				call: ['balanceOf(address)(uint256)', account],
				returns: [[`TOKEN_BALANCE_${contractAddress}`, (val: any) => val]]
			}
		})
		const ret = await aggregate(calls, {
			rpcUrl,
			multicallAddress: MULTICALL_ADDRESS
		})
		const { transformed } = ret.results

		return tokens.map((token) => {
			return {
				...token,
				balance: transformed[`TOKEN_BALANCE_${token.contractAddress}`]
			}
		})
	} catch (e) {
		console.error('getBalancesByMulticall failed', e)
		return tokens.map((token) => {
			return {
				...token,
				balance: BigNumber.from(0)
			}
		})
	}
}
