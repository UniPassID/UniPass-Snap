import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAsyncEffect, useBoolean } from 'ahooks'
import { smartAccountState, metamaskAccountTokenListState } from '@/store'
import { upNotify } from '@/components'
import { CHAIN_CONFIGS, getAddChainParameters } from '@/constants'
import { etherToWei, getBalancesByMulticall, openExplore } from '@/utils'
import { hooks, metaMask } from '@/utils'
import { makeERC20Contract } from '@/utils/make_contract'
import { TokenInfo } from '@/types'

const { useAccount, useProvider } = hooks

export const useMetaMask = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const setSmartAccountTokenList = useSetRecoilState(metamaskAccountTokenListState)
	const [rechargeLoading, { setTrue: startReChargeLoading, setFalse: endReChargeLoading }] = useBoolean(false)
	const [isRechargeDialogOpen, { setTrue: openRechargeDialog, setFalse: closeRechargeDialog }] = useBoolean(false)
	const [selectedToken, setToken] = useState<TokenInfo | undefined>(undefined)
	const [transactionAmount, setTransactionAmount] = useState<string>('')
	const [transactionHash, setTransactionHash] = useState<string>('')

	const provider = useProvider()
	const metamaskAccount = useAccount()

	const queryERC20Balances = async () => {
		if (!metamaskAccount) return
		console.log(`begin queryERC20Balances`)
		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(metamaskAccount, chain.tokens, chain.rpcUrl)
		})

		const results = await Promise.all(tasks)

		setSmartAccountTokenList(results.flat())
	}

	useAsyncEffect(queryERC20Balances, [metamaskAccount])

	const connectEagerly = async () => {
		if (metamaskAccount) return
		await metaMask.connectEagerly().catch()
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
			startReChargeLoading()

			await switchCurrentChain(token.chainId)
			const contract = makeERC20Contract(token.contractAddress, provider, metamaskAccount)
			const tx = await contract.transfer(smartAccount, etherToWei(amount, token.decimals).toHexString())
			const result = await tx.wait()

			if (result.status === 1) {
				setToken(token)
				setTransactionAmount(amount)
				setTransactionHash(result.transactionHash)
				openRechargeDialog()
			} else {
				upNotify.error('recharge failed')
			}
		} catch (error: any) {
			const errorCode = (error.data as any)?.originalError?.code || (error.data as any)?.code || error.code
			const message = error?.reason || error.message
			if (errorCode !== 'NETWORK_ERROR') {
				upNotify.error(message)
			}
		} finally {
			endReChargeLoading()
		}
	}

	const viewInExplore = () => openExplore(selectedToken!.chainId, transactionHash, 'tx')

	return {
		metamaskAccount,
		connectEagerly,
		connect,
		recharge,
		rechargeLoading,
		isRechargeDialogOpen,
		closeRechargeDialog,
		transactionAmount,
		selectedToken,
		viewInExplore
	}
}
