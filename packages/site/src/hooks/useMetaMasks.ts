import { useRecoilValue, useRecoilState } from 'recoil'
import { useAsyncEffect } from 'ahooks'
import { smartAccountState, metamaskAccountTokenListState } from '@/store'
import { upNotify } from '@/components'
import { CHAIN_CONFIGS, getAddChainParameters } from '@/constants'
import { etherToWei, getBalancesByMulticall } from '@/utils'
import { hooks, metaMask } from '@/utils'
import { makeERC20Contract } from '@/utils/make_contract'
import { TokenInfo } from '@/types'

const { useAccount, useProvider } = hooks

export const useMetaMask = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const [, setSmartAccountTokenList] = useRecoilState(metamaskAccountTokenListState)

	const provider = useProvider()
	const metamaskAccount = useAccount()

	const queryERC20Balances = async () => {
		console.log(`begin queryERC20Balances`)

		if (!metamaskAccount) return
		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(metamaskAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)

		setSmartAccountTokenList(results.flat())
	}

	useAsyncEffect(queryERC20Balances, [metamaskAccount])

	const connectEagerly = async () => {
		console.log('connectEagerly')
		await metaMask.connectEagerly().catch(console.log)
	}

	useAsyncEffect(connectEagerly, [])

	const connect = async () => {
		try {
			await metaMask.activate()
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	const switchCurrentChain = async (chainId: number) => {
		await metaMask.activate(getAddChainParameters(chainId))
	}

	const recharge = async (amount: string, token: TokenInfo) => {
		if (!provider) return
		try {
			await switchCurrentChain(80001)

			const contract = makeERC20Contract(token.contractAddress, provider, metamaskAccount)

			const tx = await contract.transfer(smartAccount, etherToWei(amount, token.decimals).toHexString())

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

	return { metamaskAccount, connectEagerly, connect, recharge }
}
