import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { smartAccountState, smartAccountTokenListState, isTestnetEnvState, availableFreeQuotaState } from '@/store'
import { CHAIN_CONFIGS, MAINNET_CHAIN_IDS, TESTNET_CHAIN_IDS } from '@/constants'
import { getBalancesByMulticall } from '@/utils'
import { useEffect } from 'react'
import { getDefaultTokenList } from '@/constants/tokens'
import { getFreeQuota } from '@/request'

export const useAccount = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const isTestnetEnv = useRecoilValue(isTestnetEnvState)
	const [tokens, setSmartAccountTokenList] = useRecoilState(smartAccountTokenListState)
	const setAvailableFreeQuota = useSetRecoilState(availableFreeQuotaState)

	const queryERC20Balances = async () => {
		console.log(`begin query smart account(${smartAccount}) tokens balance`)

		const validChainIds = isTestnetEnv ? TESTNET_CHAIN_IDS : MAINNET_CHAIN_IDS

		const tasks = CHAIN_CONFIGS.filter((chain) => validChainIds.includes(chain.chainId)).map((chain) => {
			return getBalancesByMulticall(smartAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)
		const _tokens = results.flat()

		setSmartAccountTokenList(_tokens)
	}

	// polling to query balance
	const { run: handleQueryERC20Balance } = useRequest(queryERC20Balances, {
		ready: !!smartAccount,
		refreshDeps: [smartAccount, isTestnetEnv],
		pollingInterval: 10000,
		debounceWait: 800
	})

	// polling to query freeQuota
	useRequest(
		async () => {
			try {
				const res = await getFreeQuota()
				setAvailableFreeQuota(res.availableFreeQuota)
			} catch (e) {
				console.error('[handleGetFreeQuota failed]', e)
			}
		},
		{
			ready: !!localStorage.getItem('up__accessToken'),
			refreshDeps: [smartAccount],
			pollingInterval: 3000
		}
	)

	// reset balance after switch env
	useEffect(() => {
		const chainIds = isTestnetEnv ? TESTNET_CHAIN_IDS : MAINNET_CHAIN_IDS
		const defaultTokenList = getDefaultTokenList(chainIds)
		setSmartAccountTokenList(defaultTokenList)
	}, [isTestnetEnv, setSmartAccountTokenList])

	return { smartAccount, queryERC20Balances, tokens, handleQueryERC20Balance }
}
