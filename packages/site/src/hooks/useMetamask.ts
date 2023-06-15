import { useEffect, useState } from 'react'
import { utils } from 'ethers'
import { useRecoilState } from 'recoil'
import { useAsyncEffect } from 'ahooks'
import { metamaskAccountState } from '@/store'
import { upNotify } from '@/components'
import { CHAIN_CONFIGS } from '@/constants'
import { getBalancesByMulticall } from '@/utils'
import { TokenInfo } from '@/types/token'

export const useMetamask = () => {
	const [metamaskAccount, setMetamaskAccountState] = useRecoilState(metamaskAccountState)
	const [tokens, setTokens] = useState<Array<TokenInfo>>([])

	useEffect(() => {
		const provider = window.ethereum
		provider.on('accountsChanged', handleAccountsChanged)

		return () => {
			provider.removeListener('accountsChanged', handleAccountsChanged)
		}
	}, [])

	const queryERC20Balances = async () => {
		if (!metamaskAccount) return
		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(metamaskAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)

		setTokens(results.flat())
	}

	useAsyncEffect(queryERC20Balances, [metamaskAccount])

	const handleAccountsChanged = (accounts: any) => {
		if (accounts && accounts.length > 0 && accounts[0]) {
			setMetamaskAccountState(utils.getAddress(accounts[0]))
		}
	}

	const handleGetEOAAddress = async () => {
		try {
			const provider = window.ethereum
			const accounts = await provider.request<string[]>({ method: 'eth_requestAccounts', params: [] })

			if (accounts && accounts.length > 0 && accounts[0]) {
				setMetamaskAccountState(utils.getAddress(accounts[0]))
			}
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	return { metamaskAccount, tokens, handleGetEOAAddress }
}
