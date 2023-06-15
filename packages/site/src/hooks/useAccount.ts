import { useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { smartAccountState, smartAccountTotalBalanceState } from '@/store'
import { CHAIN_CONFIGS } from '@/constants'
import { getBalancesByMulticall, weiToEther } from '@/utils'
import { TokenInfo } from '@/types/token'

export const useAccount = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const [smartAccountTotalBalance, setSmartAccountTotalBalanceState] = useRecoilState(smartAccountTotalBalanceState)
	const [tokens, setTokens] = useState<Array<TokenInfo>>([])

	const queryERC20Balances = async () => {
		console.log(`begin query smart account(${smartAccount}) tokens balance`)

		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(smartAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)
		const _tokens = results.flat()
		setTokens(_tokens)

		let totalBalance = 0

		_tokens.forEach((token) => {
			totalBalance = totalBalance + parseFloat(weiToEther(token.balance || 0, token.decimals))
		})

		setSmartAccountTotalBalanceState(totalBalance.toFixed(2))
	}

	// polling to query balance
	useRequest(queryERC20Balances, {
		ready: !!smartAccount,
		refreshDeps: [smartAccount],
		pollingInterval: 10000
	})

	return { smartAccount, smartAccountTotalBalance, queryERC20Balances, tokens }
}
