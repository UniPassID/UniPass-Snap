import { useState } from 'react'
import { BigNumber, providers } from 'ethers'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAsyncEffect, useBoolean } from 'ahooks'
import {
	smartAccountState,
	metamaskAccountTokenListState,
	currentSideBarState,
	isTestnetEnvState,
	currentChainIdState,
	smartAccountInsState
} from '@/store'
import { upNotify } from '@/components'
import { CHAIN_CONFIGS, getAddChainParameters } from '@/constants'
import { etherToWei, getBalancesByMulticall, openExplore, upGA } from '@/utils'
import { hooks, metaMask } from '@/utils'
import { makeERC20Contract } from '@/utils/make_contract'
import { TokenInfo } from '@/types'

const { useAccount, useProvider } = hooks

export const useMetaMask = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const smartAccountIns = useRecoilValue(smartAccountInsState)
	const isTestnetEnv = useRecoilValue(isTestnetEnvState)
	const setCurrentSideBar = useSetRecoilState(currentSideBarState)
	const setCurrentChainId = useSetRecoilState(currentChainIdState)
	const setMetaMaskAccountTokenList = useSetRecoilState(metamaskAccountTokenListState)
	const [rechargeLoading, { setTrue: startReChargeLoading, setFalse: endReChargeLoading }] = useBoolean(false)
	const [isRechargeDialogOpen, { setTrue: openRechargeDialog, setFalse: closeRechargeDialog }] = useBoolean(false)
	const [erc20Loading, { setTrue: enableErc20Loading, setFalse: disableErc20Loading }] = useBoolean(false)
	const [selectedToken, setToken] = useState<TokenInfo | undefined>(undefined)
	const [transactionAmount, setTransactionAmount] = useState<string>('')
	const [transactionHash, setTransactionHash] = useState<string>('')

	// for GA
	const [connectByHandle, { setTrue: setConnectByHandle, setFalse: reSetConnectByHandle }] = useBoolean(false)

	const provider = useProvider()
	const metamaskAccount = useAccount()

	const queryERC20Balances = async () => {
		if (!metamaskAccount) return
		console.log(`begin queryERC20Balances`)

		enableErc20Loading()
		const tasks = CHAIN_CONFIGS.map((chain) => {
			return getBalancesByMulticall(metamaskAccount, chain.tokens, chain.rpcUrl)
		})

		const results = (await Promise.all(tasks)).flat()

		setMetaMaskAccountTokenList(results)

		disableErc20Loading()
		if (!connectByHandle) return

		let balance = BigNumber.from(0)

		results.forEach((token) => {
			balance = balance.add(token.balance || 0)
		})

		console.log(`balance.isZero: ${balance.isZero()}`)

		upGA('topup-mm-get_balance-success', 'topup', {
			Environment: isTestnetEnv ? 'Testnet' : 'Mainnet',
			MetamaskBalance: balance.isZero() ? 'no_usdtc_balance' : 'with_usdtc_balance'
		})
	}

	useAsyncEffect(queryERC20Balances, [metamaskAccount])

	const connectEagerly = async () => {
		if (metamaskAccount) return
		await metaMask.connectEagerly().catch()
	}

	useAsyncEffect(connectEagerly, [])

	const connect = async () => {
		try {
			upGA('topup-mm-click-get_address', 'topup', { Environment: isTestnetEnv ? 'Testnet' : 'Mainnet' })
			setConnectByHandle()
			await metaMask.activate()
			upGA('topup-mm-get_address-success', 'topup', { Environment: isTestnetEnv ? 'Testnet' : 'Mainnet' })
		} catch (e: any) {
			upNotify.error(e.message)
		} finally {
			reSetConnectByHandle()
		}
	}

	const switchCurrentChain = async (chainId: number) => {
		await metaMask.activate(getAddChainParameters(chainId))
	}

	const recharge = async (amount: string, token: TokenInfo) => {
		if (!provider) return

		try {
			startReChargeLoading()
			upGA('topup-mm-click-topup', 'topup', { ChainID: token.chainId, TopupToken: token.symbol, TopupAmount: amount })
			await switchCurrentChain(token.chainId)
			// @ts-ignore
			const _provider = new providers.Web3Provider(window.ethereum, 'any')
			const contract = makeERC20Contract(token.contractAddress, _provider, metamaskAccount)
			const tx = await contract.transfer(smartAccount, etherToWei(amount, token.decimals).toHexString())
			const result = await tx.wait()

			if (result.status === 1) {
				setToken(token)
				setTransactionAmount(amount)
				setTransactionHash(result.transactionHash)
				openRechargeDialog()
				upGA('topup-mm-success', 'topup', {
					ChainID: token.chainId,
					TopupToken: token.symbol,
					TopupAmount: amount,
					MMAddress: `_${metamaskAccount}`,
					SnapAddress: `_${smartAccount}`,
					TxHash: `_${result.transactionHash}`
				})
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

	const viewInExplore = () => {
		if (selectedToken) {
			openExplore(selectedToken!.chainId, transactionHash, 'tx')
			upGA('topup-mm-success-click-view_in_explorer', 'topup', {
				ChainID: selectedToken.chainId,
				TopupToken: selectedToken.symbol,
				TopupAmount: transactionAmount,
				MMAddress: `_${metamaskAccount}`,
				SnapAddress: `_${smartAccount}`,
				TxHash: `_${transactionHash}`
			})
		}
	}

	const goToPayment = () => {
		setCurrentSideBar('Payment')
		if (selectedToken) {
			smartAccountIns?.switchChain(selectedToken.chainId)
			setCurrentChainId(selectedToken.chainId)
			upGA('topup-mm-success-click-go_to_payment', 'topup', {
				ChainID: selectedToken.chainId,
				TopupToken: selectedToken.symbol,
				TopupAmount: transactionAmount,
				MMAddress: `_${metamaskAccount}`,
				SnapAddress: `_${smartAccount}`,
				TxHash: `_${transactionHash}`
			})
		}
	}

	return {
		metamaskAccount,
		connectEagerly,
		connect,
		erc20Loading,
		queryERC20Balances,
		recharge,
		rechargeLoading,
		isRechargeDialogOpen,
		closeRechargeDialog,
		transactionAmount,
		selectedToken,
		viewInExplore,
		goToPayment
	}
}
