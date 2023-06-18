import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useAsyncEffect } from 'ahooks'
import { smartAccountState } from '@/store'
import { upNotify } from '@/components'
import { CHAIN_CONFIGS, getAddChainParameters } from '@/constants'
import { etherToWei, getBalancesByMulticall } from '@/utils'
import { TokenInfo } from '@/types/token'
import { hooks, metaMask } from '@/utils'
import { makeERC20Contract } from '@/utils/make_contract'

const { useAccount, useProvider } = hooks

export const useMetaMask = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const [tokens, setTokens] = useState<Array<TokenInfo>>([])

	const provider = useProvider()
	const metamaskAccount = useAccount()

	const queryERC20Balances = async () => {
		if (!metamaskAccount) return
		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(metamaskAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)

		setTokens(results.flat())
	}

	useAsyncEffect(queryERC20Balances, [metamaskAccount])

	const connect = async () => {
		try {
			await metaMask.activate()
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	const connectEagerly = async () => {
		await metaMask.connectEagerly().catch(console.log)
	}

	const switchCurrentChain = async (chainId: number) => {
		await metaMask.activate(getAddChainParameters(chainId))
	}

	const recharge = async () => {
		if (!provider) return
		try {
			await switchCurrentChain(80001)

			const contract = makeERC20Contract('0x87F0E95E11a49f56b329A1c143Fb22430C07332a', provider, metamaskAccount)

			const tx = await contract.transfer(smartAccount, etherToWei('1', 6).toHexString())

			const result = await tx.wait()

			if (result.status === 1) {
				console.log(result.transactionHash)
				upNotify.success('recharge success')
			} else {
				upNotify.error('recharge failed')
			}
		} catch (error: any) {
			const errorCode = (error.data as any)?.originalError?.code || (error.data as any)?.code || error.code
			const message = error?.reason || error.message
			if (errorCode !== 'NETWORK_ERROR') {
				upNotify.error(message)
			}
		}
	}

	return { metamaskAccount, tokens, connectEagerly, connect, recharge }
}
